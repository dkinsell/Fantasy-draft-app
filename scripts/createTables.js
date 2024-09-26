const { Pool } = require('pg');

// Create the teams table
const teamsTable = `
  CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
  );
`;

// Create the players table
const playersTable = `
  CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(50),
    team_id INT REFERENCES teams(id) ON DELETE SET NULL,
    bye INT,
    rank INT,
    positionRank INT,
    drafted BOOLEAN DEFAULT FALSE,
    draftedBy VARCHAR(100)
  );
`;

const createTables = async (pool) => {
  try {
    await pool.query(teamsTable);
    console.log('Teams table created');

    await pool.query(playersTable);
    console.log('Players table created');
  } catch (err) {
    console.error('Error creating tables', err)
  }
};

module.exports = createTables;