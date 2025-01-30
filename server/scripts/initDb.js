const { Client } = require("pg");
require("dotenv").config();

async function initializeDatabase() {
  // First connect to default postgres database
  const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: "postgres", // Connect to default postgres database
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });

  try {
    await client.connect();

    // Drop the database if it exists
    await client.query(`
      DROP DATABASE IF EXISTS fantasy_draft;
    `);

    // Create new database
    await client.query(`
      CREATE DATABASE fantasy_draft
      WITH 
      OWNER = ${process.env.PG_USER}
      ENCODING = 'UTF8'
      CONNECTION LIMIT = -1;
    `);

    console.log("Database created successfully");
  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the initialization
initializeDatabase();
