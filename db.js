// db.js — PostgreSQL connection pool with single-test startup
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the connection ONCE on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('FATAL Database Error: Password authentication failed or server unreachable.');
    console.error('Please check your .env file credentials.');
    process.exit(1); // Stops the server immediately so it doesn't spam logs
  } else {
    console.log('Connected to PostgreSQL database successfully!');
    release();
  }
});

module.exports = pool;