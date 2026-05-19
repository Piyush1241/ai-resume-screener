console.log('DB URL:', process.env.DATABASE_URL);
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const connectPostgres = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('PostgreSQL connected');
    await createUsersTable();
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
  }
};

const createUsersTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS screener_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'recruiter'
        CHECK (role IN ('admin', 'recruiter', 'hiring_manager')),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('Users table ready');
};

module.exports = { pool, connectPostgres };
