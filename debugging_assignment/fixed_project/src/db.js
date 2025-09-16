/*
 * FIXED DB: use the promise wrapper so we can use async/await and pool.execute()
 */
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'debug_db',
  waitForConnections: true,
  connectionLimit: 5
});

module.exports = pool;
