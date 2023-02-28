const express = require('express');
const router = express.Router();
const { sendInvite, getAllInvites } = require('../controllers/inviteController');

// POST endpoint to send the invite email
router.post('/invite', sendInvite);
router.post('/invites', getAllInvites);

module.exports = router;
