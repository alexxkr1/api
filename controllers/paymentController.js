const nodemailer = require('nodemailer');
const qr = require('qr-image');

exports.makePayment = (req, res) => {
    const { email } = req.body;
    const stripe = require('stripe')('sk_test_51McBtDI8HJOEZscUaJ4KTsfVwkJOrBhhKWKvPUXaZOUnDhyp6uwedV3UwLZPIOsCJgkcTdcvt2EgmOZzeWnJ402900LvsYXlss'); // replace with your own secret test key

    stripe.charges.create({
        amount: 2000,
        currency: 'usd',
        source: 'tok_visa', // use a test card number from Stripe's docs
        }, function(err, charge) {
        if (err) {
            console.error(err);
        } else {
            console.log(charge);

            // generate QR code for the user
            const qrCodeUrl = generateQRCodeUrl(email);

            // send email to the user
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'stmp.gmail.com',
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                }
            });

            const mailOptions = {
                from: 'your_email@example.com',
                to: email,
                subject: 'Your ticket QR code',
                html: `<p>Dear ${email},</p>
                        <p>Thank you for your payment. Please find attached your ticket QR code.</p>
                        <img src="${qrCodeUrl}" alt="QR code" />`
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    });
};


