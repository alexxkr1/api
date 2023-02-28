const nodemailer = require('nodemailer');
const crypto = require('crypto');

const { connection } = require('../db');

exports.getAllInvites = async (req, res) => {
  const { organization_id } = req.body;
  const connection = req.app.get('mysqlConnection');
  connection.query('SELECT * FROM invites WHERE organization_id = ?', [organization_id], (error, results) => {
    if (error) {
      console.error('Error retrieving invites from the database:', error);
      return res.status(500).json({ message: 'Error retrieving invites' });
    } else {
      return res.status(200).json(results);
    }
  });
};

exports.sendInvite = async (req, res) => {
  const { email } = req.body;
  const { organization_id } = req.body;
  // Generate a new unique token
  const token = crypto.randomBytes(20).toString('hex');

  // Save the token in the database along with the inviting organization
  const connection = req.app.get('mysqlConnection');
  connection.query(
    'INSERT INTO invites (email, token, organization_id, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY))',
    [email, token, organization_id],
    (error) => {
      if (error) {
        console.error('Error saving invite in the database:', error);
        return res.status(500).json({ message: 'Error sending invite' });
      }
    }
  );

  const inviteLink = `'http://localhost:5173/signup?token=${token}`;

  // Send invite email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'stmp.gmail.com',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Alex from Ticketer',
    to: email,
    subject: 'Invitation to join our organization',
    text: 'Please click on the following link to join our organization',
    html: `<a href="${inviteLink}">Click here to register</a>`,
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.error('Error sending invite email:', error);
      return res.status(500).json({ message: 'Error sending invite email' });
    } else {
      return res.status(200).json({ message: 'Invite sent successfully' });
    }
  });
};
