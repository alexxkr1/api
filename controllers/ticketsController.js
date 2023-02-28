app.post('/events/:eventId/tickets', (req, res) => {
    // const eventId = req.params.eventId;
    const { eventId ,name, description, price, quantity } = req.body;
  
    if (!name || !price || !quantity) {
      return res.status(400).json({ message: 'name, price, and quantity are required' });
    }
  
    const connection = req.app.get('mysqlConnection');
  
    connection.query(
      'INSERT INTO tickets (event_id, name, description, price, quantity) VALUES (?, ?, ?, ?, ?)',
      [eventId, name, description, price, quantity],
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
  });
  