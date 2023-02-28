const express = require('express');
const router = express.Router();
const { createOrganization, login , getOrganization, updateOrganization, createClient, getClients} = require('../controllers/organizationController');
const organizationMiddleware = require('../middleware/organizationsMiddleware');
const verifyToken = require('../middleware/jwtMiddleware');

router.put('/organization/:id', updateOrganization);
router.post('/organizations', verifyToken , createOrganization);
router.get('/organization/:id', getOrganization);
// router.post('/login', login);
router.get('/protected', verifyToken, (req, res) => {
  res.send('This route is protected');
});

router.post('/clients', createClient)
router.get('/clients/:id', getClients)
module.exports = router;







// const express = require('express')

// const { connection } = require('../server');
// const { route } = require('./mainRoutes');
// const router = express.Router();

// // Create an Organization
// router.post('/organizations', (req, res) => {
//     const connection = req.app.get('mysqlConnection');
//     const { userName, email, password } = req.body;
//     if (!userName || !email || !password) {
//       return res.status(400).json({ message: 'userName, email, and password are required' });
//     }
  
//     connection.query(
//       'INSERT INTO organizations (userName, email, password) VALUES (?, ?, ?)',
//       [userName, email, password],
//       (error, results) => {
//         if (error) {
//           console.error('Error inserting into the database:', error);
//           res.sendStatus(500);
//         } else {
//           const id = results.insertId;
//           res.status(201).json({ id, userName, email, password });
//         }
//       }
//     );
//   });
  

// router.post('/login', (req, res) => {
//   const connection = req.app.get('mysqlConnection');
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ message: 'email, and password are required' });
//   }

//   connection.query(
//     'SELECT email, password FROM organizations WHERE email = ?',
//     [email],
//     (error, results) => {
//       if (error) {
//         console.error('Error selecting from the database:', error);
//         res.sendStatus(500);
//       } else if (results.length === 0) {
//         res.status(401).json({ message: 'Invalid email or password' });
//       } else if (results[0].password === password) {
//         res.status(200).json({ message: 'Login successful' });
//       } else {
//         res.status(401).json({ message: 'Invalid email or password' });
//       }
//     }
//   );
// });
  

//   router.get('/organization/:id/events', (req, res) => {
//     const connection = req.app.get('mysqlConnection');
//     const { id } = req.params;
  
//     connection.query(
//       'SELECT events.*, organizations.userName AS organizationName FROM events JOIN organizations ON events.organizationId = organizations.organizationId WHERE organizations.organizationId = ?',
//       [id],
//       (error, results) => {
//         if (error) {
//           console.error('Error querying the database:', error);
//           res.sendStatus(500);
//         } else {
//           res.json(results);
//         }
//       }
//     );
//   });
  
  


// module.exports = router;


