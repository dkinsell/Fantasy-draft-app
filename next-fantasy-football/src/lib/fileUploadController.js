import * as xlsx from "xlsx";
import fs from "fs";
import pool from "./db";

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

fileUploadController.handleFileUpload = async (file) => {
  try {
    // Check that a file was uploaded
    if (!file) {
      return {
        success: false,
        message: "No file uploaded or unsupported file type",
        status: 400,
      };
    }

    // Process file directly from buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    
    // Extract and process players
    const players = extractPlayersFromExcel(sheet);
    await savePlayersToDatabase(players);
    
    return {
      success: true, 
      message: "File processed successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error processing file upload:", error);
    return {
      success: false, 
      message: "File processing failed: " + error.message,
      status: 500,
    };
  }
};

export default fileUploadController;
