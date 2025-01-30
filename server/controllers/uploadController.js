const pool = require("../config/db");
const xlsx = require("xlsx");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
// const Player = require('../models/players');

const uploadController = {};

// Function to get team_id from team abbreviation
const getTeamId = async (teamAbbr) => {
  const result = await pool.query("SELECT id FROM teams WHERE name = $1", [
    teamAbbr,
  ]);
  return result.rows[0]?.id;
};

// Save players to the DB
const savePlayersToDatabase = async (players) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // Start transaction

    // First, delete existing players
    const deleteResult = await client.query("DELETE FROM players");
    console.log(`Deleted ${deleteResult.rowCount} existing players`);

    // Insert all players
    let insertedCount = 0;
    for (const player of players) {
      const team_id = await getTeamId(player.team);
      if (!team_id) {
        console.warn(`No team_id found for team: ${player.team}`);
        continue;
      }

      const query = `
        INSERT INTO players (name, team_id, position, bye, rank, positionRank, drafted, draftedBy)
        VALUES ($1, $2, $3, $4, $5, $6, false, NULL)
        RETURNING id;
      `;

      const values = [
        player.name,
        team_id,
        player.position,
        player.bye,
        player.rank,
        player.positionRank,
      ];

      const result = await client.query(query, values);
      if (result.rows.length > 0) {
        insertedCount++;
      }
    }

    await client.query("COMMIT"); // Commit transaction
    console.log(
      `Successfully inserted ${insertedCount} out of ${players.length} players`
    );

    // Verify the insertion
    const verifyResult = await client.query("SELECT COUNT(*) FROM players");
    console.log(
      `Total players in database after insert: ${verifyResult.rows[0].count}`
    );
  } catch (err) {
    await client.query("ROLLBACK"); // Rollback on error
    console.error("Error during save:", err);
    throw err;
  } finally {
    client.release();
  }
};

// Sends file to appropriate parsing function and then saves returned data
uploadController.handleFileUpload = async (req, res, next) => {
  const filePath = path.join(__dirname, "../uploads", req.file.filename);

  try {
    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      const players = extractPlayersFromPDF(pdfData.text);
      await savePlayersToDatabase(players);
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const players = extractPlayersFromExcel(sheet);

      console.log("Extracted players:", players.length);
      console.log("Sample players:", players.slice(0, 3)); // Log first 3 players

      await savePlayersToDatabase(players);
      console.log("Database save complete");
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type",
      });
    }

    res.json({
      success: true,
      message: "File processed and data saved",
    });
  } catch (err) {
    console.error("Upload error:", err);
    next(err);
  } finally {
    // Clean up uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
  }
};

// THIS FUNCTION IS NOT WORKING. Not able to isolate individual players properly. Good luck
const extractPlayersFromPDF = (text) => {
  // Split the text by newlines
  const lines = text.split("\n");

  const players = [];

  lines.forEach((line, index) => {
    // Split each line by the pattern that matches the start of a player entry
    const playerEntries = line.split(/\d+\.\s\(/);

    playerEntries.forEach((entry, playerIndex) => {
      // Skip empty entries resulting from the split
      if (entry.trim() !== "") {
        // Add the leading "(" back to the entry for proper parsing later
        const playerInfo = `(${entry.trim()}`;
        console.log(`Player ${index + 1}-${playerIndex}: ${playerInfo}`);
        players.push(playerInfo);
      }
    });
  });

  return players;
};

// Function to parse the excel data
const extractPlayersFromExcel = (sheet) => {
  // Parses data using a method available to us from xlsx
  const rawData = xlsx.utils.sheet_to_json(sheet, {
    header: 1, // Use first row as headers
    blankrows: false,
    range: 1, // Skip header row
  });

  const positionCounts = {};

  return rawData
    .filter((row) => row.length > 0) // Skip empty rows
    .map((row) => {
      const position = row[2]; // POS column
      if (!positionCounts[position]) {
        positionCounts[position] = 1;
      } else {
        positionCounts[position] += 1;
      }

      return {
        name: row[1], // Player column
        position: row[2], // POS column
        team: row[3], // Team column
        bye: row[4], // Bye column
        rank: row[0], // # column
        positionRank: positionCounts[position],
      };
    })
    .filter((player) => player.name && player.position); // Filter out any invalid rows
};

module.exports = uploadController;
