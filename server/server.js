const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const mongoose = require('mongoose');
const uploadRoutes = require("./routes/upload");
const playerRoutes = require("./routes/player");
const createTables = require("./scripts/createTables");
require("dotenv").config();

// Import the DB pool
const pool = require("./config/db");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse incoming JSON
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Run the table creation script
createTables(pool);

// API Routes
app.get("/api/players", async (req, res) => {
  try {
    // First, log the total count
    const countResult = await pool.query("SELECT COUNT(*) FROM players");
    console.log("Total players in database:", countResult.rows[0].count);

    const result = await pool.query(`
      WITH latest_timestamp AS (
        SELECT MAX(created_at) as max_time 
        FROM players
      )
      SELECT p.*, t.name as team_name 
      FROM players p 
      LEFT JOIN teams t ON p.team_id = t.id
      WHERE p.created_at = (SELECT max_time FROM latest_timestamp)
      ORDER BY p.rank ASC;
    `);

    // Log more details about the results
    console.log("Query results length:", result.rows.length);
    console.log("First few players:", result.rows.slice(0, 3));
    console.log("Last few players:", result.rows.slice(-3));

    res.json({
      success: true,
      players: result.rows || [],
      totalCount: parseInt(countResult.rows[0].count),
      timestamp: result.rows[0]?.created_at,
    });
  } catch (err) {
    console.error("Error fetching players:", err);
    res.status(500).json({
      success: false,
      players: [],
      error: "Failed to fetch players",
    });
  }
});

// Route handlers
app.use("/upload", uploadRoutes); // Routes for handling file uploads
app.use("/player", playerRoutes); // Routes for handling player data

// Unknown route handler
app.use((req, res) => res.sendStatus(404));

// Global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };

  const errorObj = Object.assign({}, defaultErr, err);
  console.error(errorObj.log, errorObj); // Log the full error

  return res.status(errorObj.status).json({
    message: errorObj.message.err,
    error: err.message,
    stack: err.stack, // Include the stack trace for debugging
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
