const xlsx = require('xlsx');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const Player = require('../models/players');

const handleFileUpload = (req, res, next) => {
  const filePath = path.join(__dirname, '../uploads', req.file.filename);
  
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
  } else if ( req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const players = extractPlayersFromExcel(sheet);

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


const extractPlayersFromExcel = (sheet) => {
  const players = xlsx.utils.sheet_to_json(sheet);
  const positionCounts = {};

  return players.map((player, index) => {
    const position = player['POS'];
    if (!positionCounts[position]) {
      positionCounts[position] = 1;
    } else {
      positionCounts[position] += 1;
    }

    return {
      rank: player['#'],
      name: player['Player'],
      position: position,
      positionRank: positionCounts[position],
      team: player['Team'],
      bye: player['Bye']
    };
  });
};


// Uncomment once mongo is setup
const savePlayersToDatabase = (players) => {
  return Player.deleteMany({}) // Delete all existing players
    .then(() => {
      return Player.insertMany(players); // Insert new players
    });
};

// Test with no Mongo
// const savePlayersToDatabase = (players) => {
//   console.log('Mock saving players to database:', players);
//   return Promise.resolve(); 
// };

module.exports = {
  handleFileUpload,
}