const { Pool } = require("pg");

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
    positionrank VARCHAR(10),
    drafted BOOLEAN DEFAULT FALSE,
    draftedBy VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Insert NFL teams
const insertTeams = `
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
`;

const createTables = async (pool) => {
  try {
    await pool.query(teamsTable);
    console.log("Teams table created");

    await pool.query(playersTable);
    console.log("Players table created");

    await pool.query(insertTeams);
    console.log("Teams data inserted");
  } catch (err) {
    console.error("Error creating tables", err);
  }
};

module.exports = createTables;
