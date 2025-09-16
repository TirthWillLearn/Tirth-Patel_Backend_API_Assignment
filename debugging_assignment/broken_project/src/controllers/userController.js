const pool = require('../db');

// BROKEN: no try/catch, using req.body though express.json() is registered *after* routes
async function createUser(req, res) {
  const { name, email } = req.body; // req.body may be undefined
  // BROKEN: using string interpolation and no parameterization (SQL injection risk)
  const [result] = await pool.execute(`INSERT INTO users (name,email) VALUES ('${name}','${email}')`);
  res.status(201).json({ id: result.insertId });
}

// BROKEN: wrong column name 'userid' instead of 'id'
async function getUser(req, res) {
  const id = req.params.id;
  const [rows] = await pool.execute('SELECT * FROM users WHERE userid = ?', [id]);
  if (!rows.length) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(rows[0]);
}

module.exports = { createUser, getUser };
