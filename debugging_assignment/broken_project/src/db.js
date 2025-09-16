/*
 * BROKEN DB: Using mysql2 (non-promise) but controllers expect promise style.
 * This is intentionally wrong for the assignment.
 */
const mysql = require('mysql2');
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'debug_db',
  waitForConnections: true,
  connectionLimit: 5
});

module.exports = pool;
