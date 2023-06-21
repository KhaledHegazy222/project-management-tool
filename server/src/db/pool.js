const { Pool } = require('pg');
require('dotenv').config();

const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 300000,
  idleTimeoutMillis: 300000,
  max: 20,
};

const pool = new Pool(dbConfig);

// check db connection
pool.on('connect', () => {
  console.log('connected to db');
});
pool.on('remove', () => {
  console.log('disconnected to db');
});

module.exports = pool;
