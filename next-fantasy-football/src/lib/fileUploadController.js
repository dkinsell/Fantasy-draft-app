import * as xlsx from "xlsx";
import fs from "fs";
import pool from "./db";

const fileUploadController = {};

// Cache for team IDs to avoid repeated queries
let teamCache = null;

// Function to get all team IDs at once
const getTeamIds = async () => {
  if (teamCache) return teamCache;
  
  const result = await pool.query("SELECT id, name FROM teams");
  teamCache = result.rows.reduce((acc, team) => {
    acc[team.name] = team.id;
    return acc;
  }, {});
  
  return teamCache;
};

// Save players to the DB using batch inserts
const savePlayersToDatabase = async (players) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    // Get all team IDs in a single query
    const teamIds = await getTeamIds();
    
    // Prepare batch values for insertion
    const values = [];
    const placeholders = [];
    let paramIndex = 1;
    
    players.forEach(player => {
      const team_id = teamIds[player.team];
      if (!team_id) return; // Skip if team not found
      
      values.push(
        player.name,
        team_id,
        player.position,
        player.bye,
        player.rank,
        player.positionrank
      );
      
      placeholders.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4}, $${paramIndex + 5})`);
      paramIndex += 6;
    });
    
    if (values.length > 0) {
      // Execute a single batch insert
      const query = `
        INSERT INTO players (name, team_id, position, bye, rank, positionrank)
        VALUES ${placeholders.join(', ')}
      `;
      await client.query(query, values);
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
    
    // Clear team cache if needed (in case of team changes)
    teamCache = null;
    
    // Time the database operation
    const startTime = Date.now();
    await savePlayersToDatabase(players);
    const endTime = Date.now();
    console.log(`Database operation took ${endTime - startTime}ms`);
    
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
