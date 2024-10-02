const pool = require('../config/db');
const xlsx = require('xlsx');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
// const Player = require('../models/players');

const uploadController = {};

// Save players to the DB
const savePlayersToDatabase = (players) => {
  const promises = players.map(player => {
    const query = `
      INSERT INTO players (name, team_id, position, bye, rank, positionRank, drafted, draftedBy)
      VALUES ($1, $2, $3, $4, $5, $6, false, NULL)
      RETURNING *;
    `;
    const values = [
      player.name,
      player.team_id,
      player.position,
      player.bye,
      player.rank,
      player.positionRank
    ];
    return pool.query(query, values);
  });
  return Promise.all(promises);
};

// Sends file to appropriate parsing function and then saves returned data
uploadController.handleFileUpload = (req, res, next) => {
  const filePath = path.join(__dirname, '../uploads', req.file.filename);
  
  // If PDF convert the file to binary in the buffer, extract the data in the helper function, and save to DB
  if (req.file.mimetype === 'application/pdf') {

    const dataBuffer = fs.readFileSync(filePath);
    pdfParse(dataBuffer)
      .then(pdfData => {
        const extractedText = pdfData.text;
        const players = extractPlayersFromPDF(extractedText);
        return savePlayersToDatabase(players);
      })
      .then(() => {
          res.json({ message: 'File processed and data saved' });
      })
      .catch(err => {
        next(err);
      });
  // If excel, isolate the object we want (sheet) and save to DB
  } else if ( req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const players = extractPlayersFromExcel(sheet);

    // Saves the returned players to our DB and send the appropriate response
    savePlayersToDatabase(players)
      .then(() => {
        res.json({ message: 'File processed and data saved' });
      })
      .catch(err => {
        next(err);
      });
  } else {
    res.status(400).json({ message: 'Unsupported file type' })
  }
};

// THIS FUNCTION IS NOT WORKING. Not able to isolate individual players properly. Good luck
const extractPlayersFromPDF = (text) => {
  // Split the text by newlines
  const lines = text.split('\n');

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
  const players = xlsx.utils.sheet_to_json(sheet);
  const positionCounts = {};

  // Maps the data based on the players model
  return players.map((player, index) => {
    const position = player['POS'];
    if (!positionCounts[position]) {
      positionCounts[position] = 1;
    } else {
      positionCounts[position] += 1;
    }

    return {
      name: player['Player'],
      position: position,
      team: player['Team'],
      bye: player['Bye'],
      rank: player['#'],
      positionRank: positionCounts[position],
    };
  });
};

module.exports = uploadController;