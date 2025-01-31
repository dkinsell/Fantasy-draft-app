const { Pool } = require("pg");
require("dotenv").config();

// PostgreSQL connection
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: "fantasy_draft",
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Test DB connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client", err.stack);
  } else {
    console.log("Connected to PostgreSQL successfully");
  }
  release();
});

module.exports = pool;
