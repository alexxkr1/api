const express = require('express');
const router = express.Router();
const { createOrganization, login } = require('../controllers/organizationController');
const organizationMiddleware = require('../middleware/organizationsMiddleware');
const verifyToken = require('../middleware/jwtMiddleware');



exports.login = (req, res) => {
    const connection = req.app.get('mysqlConnection');
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email, and password are required' });
    }
  
    connection.query(
      'SELECT * FROM organizations WHERE email = ?',
      [email],
      async (error, results) => {
        if (error) {
          console.error('Error selecting from the database:', error);
          res.sendStatus(500);
        } else if (results.length > 0) {
          const user = results[0];
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET);
            console.log('JWT token:', token);
            res.status(200).json({ message: 'Login successful', token });
          } else {
            res.status(401).json({ message: 'Invalid email or password' });
          }
        } else {
          connection.query(
            'SELECT * FROM users WHERE email = ?',
            [email],
            async (error, results) => {
              if (error) {
                console.error('Error selecting from the database:', error);
                res.sendStatus(500);
              } else if (results.length > 0) {
                const user = results[0];
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
                  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET);
                  console.log('JWT token:', token);
                  res.status(200).json({ message: 'Login successful', token });
                } else {
                  res.status(401).json({ message: 'Invalid email or password' });
                }
              } else {
                res.status(401).json({ message: 'Invalid email or password' });
              }
            }
          );
        }
      }
    );
  };
  