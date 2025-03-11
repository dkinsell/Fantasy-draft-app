import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection
pool.connect()
  .then(() => console.log('Connected to Neon Postgres'))
  .catch((err) => console.error('Failed to connect:', err));

export default pool;
