const pool = require('../db');

// FIXED: proper try/catch and parameterized queries to avoid SQL injection
async function createUser(req, res, next) {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'name and email required' });

    const [result] = await pool.execute('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
}

// FIXED: use correct column 'id' and parameterized query
async function getUser(req, res, next) {
  try {
    const id = req.params.id;
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { createUser, getUser };
