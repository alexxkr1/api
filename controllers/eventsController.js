const connection = require('../db');

exports.deleteEvent = (req, res) => {
  const connection = req.app.get('mysqlConnection');
  const id = req.params.id;

  connection.query(
    'DELETE FROM events WHERE id = ?',
    [id],
    (error, results) => {
      if (error) {
        console.error('Error deleting from the database:', error);
        res.sendStatus(500);
      } else if (results.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    }
  );
};

exports.createEvent = (req, res) => {
  const connection = req.app.get('mysqlConnection');
  const { organization_id, name, description, location, start_datetime, tags } = req.body;

  if (!organization_id || !name || !description || !location || !start_datetime || !tags) {
    return res.status(400).json({ message: 'organization_id, name, description, location, start_datetime, and tags are required' });
  }

  connection.query(
    'INSERT INTO events (organization_id, name, description, location, start_datetime, tags) VALUES (?, ?, ?, ?, ?, ?)',
    [organization_id, name, description, location, start_datetime, tags],
    (error, results) => {
      if (error) {
        console.error('Error inserting into the database:', error);
        res.sendStatus(500);
      } else {
        const id = results.insertId;
        res.status(201).json({ id, organization_id, name, description, location, start_datetime, tags });
      }
    }
  );
};

exports.updateEvent = (req, res) => {
  const connection = req.app.get('mysqlConnection');
  const { name, description, location, start_datetime, tags } = req.body;
  const id = req.params.id;

  if (!name || !description || !location || !start_datetime || !tags) {
    return res.status(400).json({ message: 'name, description, location, start_datetime, and tags are required' });
  }

  connection.query(
    'UPDATE events SET name = ?, description = ?, location = ?, start_datetime = ?, tags = ? WHERE id = ?',
    [name, description, location, start_datetime, tags, id],
    (error, results) => {
      if (error) {
        console.error('Error updating the database:', error);
        res.sendStatus(500);
      } else if (results.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(200);
      }
    }
  );
};

exports.getEvent = (req, res) => {
  const connection = req.app.get('mysqlConnection');
  const id = req.body;

  connection.query(
    'SELECT * FROM events WHERE id = ?',
    [id],
    (error, results) => {
      if (error) {
        console.error('Error querying the database:', error);
        return res.sendStatus(500);
      } else if (results.length === 0) {
        return res.status(404).json({ message: 'Organization not found' });
      } else {
        const organization = results[0];
        res.json({ organization });
      }
    }
  );
};

exports.createTicket = (req, res) => {
  const eventId = req.params.eventId;
  const {  event_id, name, description, price, quantity } = req.body;

  if (!name || !price || !quantity) {
    return res.status(400).json({ message: 'name, price, and quantity are required' });
  }

  const connection = req.app.get('mysqlConnection');

  connection.query(
    'INSERT INTO tickets (event_id, name, description, price, quantity) VALUES (?, ?, ?, ?, ?)',
    [event_id, name, description, price, quantity],
    (error, results) => {
      if (error) {
        console.error('Error inserting into the database:', error);
        res.sendStatus(500);
      } else {
        const id = results.insertId;
        res.status(201).json({ id, eventId, name, description, price, quantity });
      }
    }
  );
};

exports.getTickets = async (req, res) => {
  const { event_id } = req.body;
  const connection = req.app.get('mysqlConnection');
  connection.query('SELECT * FROM tickets WHERE event_id = ?', [event_id], (error, results) => {
    if (error) {
      console.error('Error retrieving invites from the database:', error);
      return res.status(500).json({ message: 'Error retrieving invites' });
    } else {
      return res.status(200).json(results);
    }
  });
};

exports.getAllEvents = (req, res) => {
  const connection = req.app.get('mysqlConnection');
  connection.query(
    'SELECT * FROM events',
    (error, results) => {
      if (error) {
        console.error('Error retrieving events from the database:', error);
        res.sendStatus(500);
      } else {
        res.status(200).json({ events: results });
      }
    }
  );
};

exports.getAllEventsById = (req, res) => {
  const connection = req.app.get('mysqlConnection');
  const organization_id = req.params.organization_id;

  connection.query(
    'SELECT * FROM events WHERE organization_id = ?',
    [organization_id],
    (error, results) => {
      if (error) {
        console.error('Error retrieving events from the database:', error);
        res.sendStatus(500);
      } else {
        res.status(200).json({ events: results });
      }
    }
  );
};


exports.getSingleEvents = (req, res) => {
  const eventId = req.params.eventId;

  const connection = req.app.get('mysqlConnection');
  connection.query(
    'SELECT * FROM events WHERE id = ?',
    [eventId],
    (error, results) => {
      if (error) {
        console.error('Error retrieving events from the database:', error);
        res.sendStatus(500);
      } else {
        res.status(200).json({ events: results });
      }
    }
  );
};

exports.deleteTicket = (req, res) => {
  const connection = req.app.get('mysqlConnection');
  const id = req.params.id;

  connection.query(
    'DELETE FROM tickets WHERE id = ?',
    [id],
    (error, results) => {
      if (error) {
        console.error('Error deleting from the database:', error);
        res.sendStatus(500);
      } else if (results.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    }
  );
};

exports.updateTicket = (req, res) => {
  const connection = req.app.get('mysqlConnection');
  const { name, description, price, quantity } = req.body;
  const id = req.params.id;

  if (!name || !price || !quantity) {
    return res.status(400).json({ message: 'name, price, and quantity are required' });
  }

  connection.query(
    'UPDATE tickets SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?',
    [name, description, price, quantity, id],
    (error, results) => {
      if (error) {
        console.error('Error updating the database:', error);
        res.sendStatus(500);
      } else if (results.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(200);
      }
    }
  );
};