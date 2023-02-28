const connection = require('../db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



// // Create an User
// exports.registration = (req, res) => {
//     const connection = req.app.get('mysqlConnection');
//     const { name, email, password } = req.body;
//     console.log(req.body)
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'name, email, and password are required' });
//     }
  
//     connection.query(
//       'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
//       [name, email, password],
//       (error, results) => {
//         if (error) {
//           console.error('Error inserting into the database:', error);
//           res.sendStatus(500);
//         } else {
//           const id = results.insertId;
//           res.status(201).json({ id, name, email, password });
//         }
//       }
//     );
//   };


// Create an User
exports.registration = (req, res) => {
  const connection = req.app.get('mysqlConnection');
  const { name, email, password, token } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, and password are required' });
  }
  if (token) {
    console.log(token)
  }
  // Check if email already exists in database
  connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (error, results) => {
      if (error) {
        console.error('Error selecting from the database:', error);
        res.sendStatus(500);
      } else if (results.length > 0) {
        // Email already exists
        res.status(400).json({ message: 'Email already exists' });
      } else {
        // Email does not exist, proceed with registration
        if (!token) {
          // Regular registration without an invite
          connection.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password],
            (error, results) => {
              if (error) {
                console.error('Error inserting into the database:', error);
                res.sendStatus(500);
              } else {
                const id = results.insertId;
                res.status(201).json({ id, name, email, password });
              }
            }
          );
        } else {
          // Registration with an invite
          connection.query(
            'SELECT * FROM invites WHERE token = ? AND used_at IS NULL AND expires_at > NOW()',
            [token],
            (error, results) => {
              if (error) {
                console.error('Error selecting from the database:', error);
                res.sendStatus(500);
              } else if (results.length === 0) {
                // Invite not found or has already been used or expired
                res.status(400).json({ message: 'Invalid or expired invite token' });
              } else {
                const invite = results[0];

                // Insert user into the users table
                connection.query(
                  'INSERT INTO users (name, email, password, organization_id, role) VALUES (?, ?, ?, ?, ?)',
                  [name, email, password, invite.organization_id,'member'],
                  (error, results) => {
                    if (error) {
                      console.error('Error inserting into the database:', error);
                      res.sendStatus(500);
                    } else {
                      const id = results.insertId;
                      const organizationId = invite.organization_id;
                      const roleName = 'member';
                      res.status(201).json({ id, name, email, password, organizationId, roleName });

                      // Update the used_at column of the invite
                      connection.query(
                        'UPDATE invites SET used_at = NOW() WHERE id = ?',
                        [invite.id],
                        (error) => {
                          if (error) {
                            console.error('Error updating the database:', error);
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    }
  );
};

  
exports.login = (req, res) => {
const connection = req.app.get('mysqlConnection');
const { email, password } = req.body;
if (!email || !password) {
    return res.status(400).json({ message: 'email, and password are required' });
}

connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (error, results) => {
    if (error) {
        console.error('Error selecting from the database:', error);
        res.sendStatus(500);
    } else if (results.length === 0) {
        res.status(401).json({ message: 'Invalid email or password' });
    } else {
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET)
            console.log('JWT token:', token);
            res.status(200).json({ message: 'Login successful', token });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    }
);
};

exports.logout = (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const token = req.headers.authorization;
  result = token.slice(7);
  console.log(result)
  const decoded = jwt.verify(result, process.env.JWT_SECRET);
  const id = decoded.userId
  const connection = req.app.get('mysqlConnection');
  connection.query(
    'SELECT * FROM users WHERE id = ?',
    [id],
    (error, results) => {
      if (error) {
        console.error('Error inserting into the database:', error);
        res.sendStatus(500);
      } else {
        // const id = results.insertId;
        res.status(200).json({ results });
      }
    }
  );

}

