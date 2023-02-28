const express = require('express');
const router = express.Router();
const { createEvent, createTicket, getAllEvents, getAllEventsById, getEvent, getSingleEvents, getTickets, updateEvent, deleteEvent, deleteTicket, updateTicket } = require('../controllers/eventsController');
// const { createTicket } = require('../controllers/ticketsController')

router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.get('/events', getAllEvents);
router.post('/createTicket/', createTicket);
router.delete('/tickets/:id', deleteTicket);
router.put('/tickets/:id', updateTicket);
router.post('/tickets', getTickets);
router.get('/eventss/:organization_id', getAllEventsById)
router.post('/event', getEvent);
router.get('/even/:eventId', getSingleEvents)



module.exports = router;
