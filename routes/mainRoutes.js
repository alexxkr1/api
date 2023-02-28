const express = require('express')

const { connection } = require('../db');
const router = express.Router();

// Placeholder data for organization and events
const organizations = [];
const events = [
    { id: 1, name: 'Event 1', description: 'Description for event 1', date: '2023-03-01' },
    { id: 2, name: 'Event 2', description: 'Description for event 2', date: '2023-03-02' },
    { id: 3, name: 'Event 3', description: 'Description for event 3', date: '2023-03-03' }
  ];
  

router.post('/organization', (req, res) => {
    const { name, description } = req.body;
    const organization = {name, description}
    organization.push(organization);
    res.status(201).json(organization)
});

router.post('/event', (req, res) => {
    const { name, description, date } = req.body;
    const event = {name, description, date}
    event.push(event);
    res.status(201).json(event)
});

// Get all events 
router.get('/events', (req, res) => {
    const connection = req.app.get('mysqlConnection');
    // Use the connection to query the database
    connection.query('SELECT * FROM events', (error, results) => {
      if (error) {
        console.error('Error querying the database:', error);
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    });
  });

// Edit event
router.put('/event/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, date } = req.body;
    const event = events.find((e) => e.id === id);
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }
    event.name = name || event.name;
    event.description = description || event.description;
    event.date = date || event.date;
    res.json(event);
});

// Delete event
    router.delete('/event/:id', (req, res) => {
    const { id } = req.params;
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Event not found' });
    }
    events.splice(index, 1);
    res.json({ message: 'Event deleted' });
});
  

module.exports = router;