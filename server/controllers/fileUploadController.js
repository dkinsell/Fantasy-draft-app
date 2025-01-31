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
        INSERT INTO players (name, team_id, position, bye, rank, positionRank)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [
          player.name,
          team_id,
          player.position,
          player.bye,
          player.rank,
          player.positionRank,
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
      const position = row[2];
      positionCounts[position] = (positionCounts[position] || 0) + 1;

      return {
        name: row[1],
        position: row[2],
        team: row[3],
        bye: row[4],
        rank: row[0],
        positionRank: positionCounts[position],
      };
    })
    .filter((player) => player.name && player.position);
};

module.exports = fileUploadController;
