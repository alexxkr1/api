const express = require('express');
const router = express.Router();
const { registration, login, logout } = require('../controllers/usersController');
const organizationMiddleware = require('../middleware/organizationsMiddleware');
const verifyToken = require('../middleware/jwtMiddleware');

// Create an User

router.post('/registration', organizationMiddleware.hashPassword, registration);

router.post('/login', login);

router.get('/userData', logout);



module.exports = router;

