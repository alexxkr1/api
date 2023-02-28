const express = require('express');
const router = express.Router();
const { createOrganization, login } = require('../controllers/organizationController');
const organizationMiddleware = require('../middleware/organizationsMiddleware');
const verifyToken = require('../middleware/jwtMiddleware');

// Create organization
router.post('/organizations', organizationMiddleware.hashPassword, createOrganization);

// Login organization
router.post('/organizations/login', login);

// Protected route
router.get('/organizations/protected', verifyToken, (req, res) => {
  res.send('This route is protected');
});

module.exports = router;
