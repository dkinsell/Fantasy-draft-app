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
  const players = [];
  const lines = text.split('\n');

  lines.forEach(line => {
    console.log('Processing line:', line); // Debugging log

    // Split the line by the pattern that indicates the start of a new player's data
    const playerEntries = line.split(/(?=\d+\.\s\(\w+\d+\))/);

    playerEntries.forEach(entry => {
      const playerRegex = /^(\d+)\.\s\((\w+)(\d+)\)(.+?),\s([A-Z]{2,3})\$(\d+)/;
      const match = entry.match(playerRegex);

      if (!match) {
        console.log('Skipping entry:', entry); // Debugging log
        return; // Skip entries that don't match the expected format
      }

      const [_, rank, position, positionRank, name, team, bye] = match;

      const player = {
        rank: parseInt(rank),
        position: position,
        positionRank: parseInt(positionRank),
        name: name.trim(),
        team: team,
        bye: parseInt(bye)
      };

      players.push(player);
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
      positionCounts[position] = 0;
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
// const savePlayersToDatabase = (players) => {
//   return Player.insertMany(players);
// };

// Test with no Mongo
const savePlayersToDatabase = (players) => {
  console.log('Mock saving players to database:', players);
  return Promise.resolve(); 
};

module.exports = {
  handleFileUpload,
}