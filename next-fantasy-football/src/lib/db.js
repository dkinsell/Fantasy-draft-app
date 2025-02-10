import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE || "fantasy_draft",
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pool
  .connect()
  .then(async (client) => {
    console.log("Connected to PostgreSQL successfully");

    try {
      // Ensure the `players` table exists.
      await client.query(`
        CREATE TABLE IF NOT EXISTS players (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          position VARCHAR(50),
          team_id INTEGER REFERENCES teams(id),
          drafted BOOLEAN DEFAULT false,
          draftedBy VARCHAR(50),
          rank INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log("Database tables ensured.");
    } catch (err) {
      console.error("Error ensuring tables:", err);
    } finally {
      // Release the client back to the pool.
      client.release();
    }
  })
  .catch((err) => console.error("Error connecting to PostgreSQL", err));

export default pool;
