const pool = require("../config/databaseConfig");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const fileUploadController = {};

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
    await client.query("BEGIN");
    await client.query("DELETE FROM players");

    for (const player of players) {
      const team_id = await getTeamId(player.team);
      if (!team_id) continue;

      await client.query(
        `
        INSERT INTO players (name, team_id, position, bye, rank, positionrank)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [
          player.name,
          team_id,
          player.position,
          player.bye,
          player.rank,
          player.positionrank,
        ]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// Function to parse the excel data
const extractPlayersFromExcel = (sheet) => {
  const rawData = xlsx.utils.sheet_to_json(sheet, {
    header: 1,
    blankrows: false,
    range: 1,
  });

  const positionCounts = {};

  return rawData
    .filter((row) => row.length > 0)
    .map((row) => {
      const position = row[2]; // Assuming position is in the third column
      positionCounts[position] = (positionCounts[position] || 0) + 1; // Increment count for the position

      return {
        name: row[1], // Player name
        position: position, // Position
        team: row[3], // Team
        bye: row[4], // Bye week
        rank: row[0], // Rank from the sheet
        positionrank: `${position}${positionCounts[position]}`, // Format as PositionRank (e.g., RB1)
      };
    })
    .filter((player) => player.name && player.position); // Filter out any invalid rows
};

// Sends file to appropriate parsing function and then saves returned data
fileUploadController.handleFileUpload = async (req, res, next) => {
  const filePath = path.join(__dirname, "../uploads", req.file.filename);

  try {
    if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const players = extractPlayersFromExcel(sheet);
      await savePlayersToDatabase(players);

      res.json({
        success: true,
        message: "File processed and data saved",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unsupported file type",
      });
    }
  } catch (err) {
    console.error("Error details:", err);
    next({
      log: "Error in uploadController.handleFileUpload",
      status: 500,
      message: { err: "Failed to process upload" },
    });
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
  }
};

module.exports = fileUploadController;
