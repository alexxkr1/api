const connection = require('../db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.createOrganization = (req, res) => {
    const connection = req.app.get('mysqlConnection');
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }
  
    connection.beginTransaction(error => {
      if (error) {
        console.error('Error beginning transaction:', error);
        return res.sendStatus(500);
      }
  
      const userId = req.body.id;
  
      connection.query(
        'INSERT INTO organizations (name, owner_id) VALUES (?, ?)',
        [name, userId],
        (error, results) => {
          if (error) {
            console.error('Error inserting into the database:', error);
            connection.rollback(() => {
              res.sendStatus(500);
            });
          } else {
            const organizationId = results.insertId;
  
            connection.query(
              'UPDATE users SET organization_id = ?, role = "owner" WHERE id = ?',
              [organizationId, userId],
              (error) => {
                if (error) {
                  console.error('Error updating the database:', error);
                  connection.rollback(() => {
                    res.sendStatus(500);
                  });
                } else {
                  connection.commit(error => {
                    if (error) {
                      console.error('Error committing transaction:', error);
                      connection.rollback(() => {
                        res.sendStatus(500);
                      });
                    } else {
                      res.status(201).json({ organizationId, name });
                    }
                  });
                }
              }
            );
          }
        }
      );
    });
  };


  exports.updateOrganization = (req, res) => {
    const connection = req.app.get('mysqlConnection');
    const { name, registry_number, phone_number, country, city, street } = req.body;
    const organizationId = req.params.id;
  
    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }
  
    connection.query(
      'UPDATE organizations SET name = ?, registry_number = ?, phone_number = ?, country = ?, city = ?, street = ? WHERE id = ?',
      [name, registry_number, phone_number, country, city, street, organizationId],
      (error, results) => {
        if (error) {
          console.error('Error updating the database:', error);
          res.sendStatus(500);
        } else if (results.affectedRows === 0) {
          res.status(404).json({ message: 'Organization not found' });
        } else {
          res.status(200).json({ message: 'Organization updated successfully' });
        }
      }
    );
  };

  exports.getOrganization = (req, res) => {
    const connection = req.app.get('mysqlConnection');
    const id = req.params.id;

  
    connection.query(
      'SELECT * FROM organizations WHERE id = ?',
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

  exports.createClient = (req, res) => {
    const connection = req.app.get('mysqlConnection');

    const { organization_id, name, email } = req.body;
  
    if (!organization_id || !name || !email) {
      return res.status(400).json({ message: 'organization_id, name, and email are required' });
    }
  
    const sql = 'INSERT INTO clientbase (organization_id, name, email) VALUES (?, ?, ?)';
    const values = [organization_id, name, email];
  
    connection.query(sql, values, (error, results) => {
      if (error) {
        console.error('Error inserting into the database:', error);
        res.sendStatus(500);
      } else {
        const id = results.insertId;
        res.status(201).json({ id, organization_id, name, email });
      }
    });
  };

  exports.getClients = (req, res) => {
    const organizationId = req.params.id;
    const connection = req.app.get('mysqlConnection');
  
    connection.query(
      'SELECT * FROM clientbase WHERE organization_id = ?',
      [organizationId],
      (error, results) => {
        if (error) {
          console.error('Error querying the database:', error);
          res.sendStatus(500);
        } else {
          res.status(200).json(results);
        }
      }
    );
  };