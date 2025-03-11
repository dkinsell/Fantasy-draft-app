const { Pool } = require('pg');
require('dotenv').config({ path: './.env.local' });  // Explicitly load from .env.local

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false  // Required for Neon database connection
    }
  });

  try {
    // Create teams table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );
    `);

    console.log('Created teams table');

    // Create players table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        position VARCHAR(50),
        team_id INTEGER REFERENCES teams(id),
        drafted BOOLEAN DEFAULT FALSE,
        draftedBy VARCHAR(50),
        rank INTEGER,
        positionrank VARCHAR(10),
        bye INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Created players table');

    // Insert NFL teams
    await pool.query(`
      INSERT INTO teams (name)
      SELECT team 
      FROM (VALUES 
        ('ARI'), ('ATL'), ('BAL'), ('BUF'), ('CAR'), ('CHI'), ('CIN'), ('CLE'),
        ('DAL'), ('DEN'), ('DET'), ('GB'), ('HOU'), ('IND'), ('JAX'), ('KC'),
        ('LAC'), ('LAR'), ('LV'), ('MIA'), ('MIN'), ('NE'), ('NO'), ('NYG'),
        ('NYJ'), ('PHI'), ('PIT'), ('SEA'), ('SF'), ('TB'), ('TEN'), ('WAS')
      ) AS t(team)
      WHERE NOT EXISTS (
        SELECT 1 FROM teams WHERE name = t.team
      );
    `);

    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
    console.error('Connection details:', err.message);
  } finally {
    await pool.end();
  }
}

migrate();