const express = require('express');
const router = express.Router();
const { makePayment } = require('../controllers/paymentController');
const organizationMiddleware = require('../middleware/organizationsMiddleware');
const verifyToken = require('../middleware/jwtMiddleware');
// router.post('/stripe-webhook', bodyParser.raw({type: 'application/json'}), (req, res) => {
//     const sig = req.headers['stripe-signature'];
//     let event;
  
//     try {
//       event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//     } catch (err) {
//       console.error(err);
//       return res.sendStatus(400);
//     }
//   // Handle the event
// });
const bodyParser = require('body-parser');

router.use(bodyParser.json())

const stripe = require('stripe')('sk_test_51McBtDI8HJOEZscUaJ4KTsfVwkJOrBhhKWKvPUXaZOUnDhyp6uwedV3UwLZPIOsCJgkcTdcvt2EgmOZzeWnJ402900LvsYXlss'); // replace with your own secret key

router.post('/stripe/webhook', async (req, res) => {
    const event = req.body;
    const eventId = 2;
    // Handle the event here, e.g. update your database or send an email notification
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;

        // Get the price and quantity of the ticket(s) purchased
        const ticketPrice = paymentIntent.amount / 100; // Stripe amounts are in cents
        const ticketQuantity = paymentIntent.metadata.quantity;
        console.log(ticketPrice, ticketQuantity)
        // Update the events table with the total amount
        const connection = req.app.get('mysqlConnection');
        connection.query(
        'UPDATE events SET amount = amount + ? WHERE id = ?',
        [ticketPrice, eventId],
        (error, results) => {
            if (error) {
            console.error('Error updating the database:', error);
            } else {
            console.log('Event amount updated:', eventId);
            }
        }
        );
        break;
      case 'payment_intent.payment_failed':

        console.log('Payment failed:', paymentIntent.id);
        // Handle the failure
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}`);
    }
    res.sendStatus(200);
  });


router.post('/create-checkout-session', async (req, res) => {
  const { lineItems, successURL, cancelURL } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successURL,
      cancel_url: cancelURL,
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to create checkout session.' });
  }
});


// router.post('/payment' , makePayment);


module.exports = router;

