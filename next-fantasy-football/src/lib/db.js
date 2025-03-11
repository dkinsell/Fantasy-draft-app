import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Skip connection during build
const isVercelBuild = process.env.VERCEL_ENV === 'production' && process.env.CI;

let pool;
if (!isVercelBuild) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  // Test the connection (but only in non-build environments)
  pool.connect()
    .then(() => console.log('Connected to Neon Postgres'))
    .catch((err) => console.error('Failed to connect:', err));
} else {
  console.log('Skipping database connection during build');
  // Create a mock pool that will throw clear errors if accidentally used during build
  pool = {
    query: () => Promise.reject(new Error('Database connection not available during build')),
    connect: () => Promise.reject(new Error('Database connection not available during build')),
  };
}

export default pool;
