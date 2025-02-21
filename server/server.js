const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUploadRoutes = require("./routes/fileUploadRoutes");
const playerDraftRoutes = require("./routes/playerDraftRoutes");
const playerApiRoutes = require("./routes/playerApiRoutes");
const createTables = require("./scripts/createTables");
require("dotenv").config();

// Import the DB pool
const pool = require("./config/databaseConfig");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse incoming JSON
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Run the table creation script
createTables(pool);

// Route handlers
app.use("/api", playerApiRoutes); // API routes
app.use("/upload", fileUploadRoutes); // Upload routes
app.use("/player", playerDraftRoutes); // Player routes

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
