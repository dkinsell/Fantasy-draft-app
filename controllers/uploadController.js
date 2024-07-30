const pdfParse = require('pdf-parse');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Player = require('../models/players');

const handleFileUpload = (req, res, next) => {
  const filePath = path.join(__dirname, '../uploads', req.file.filename);
  
  if (req.file.mimetype === 'application/pdf') {

    const dataBuffer = fs.readFileSync(filePath);
    pdfParse(dataBuffer)
      .then(data => {

        const players = extractPlayersFromPDF(data.text);

        savePlayersToDatabase(players)
          .then(() => res.json({ message: 'File processed and data saved' }))
          .catch(next);
      })
      .catch(next);
  } else if ( req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const players = xlsx.utils.sheet_to_json(sheet);

    savePlayersToDatabase(players)
      .then(() => res.json({ message: 'File processed and data saved' }))
      .catch(next);
  } else {
    res.status(400).json({ message: 'Unsupported file type' })
  }
};

const extractPlayersFromPDF = (text) => {
  const players = [];
  const lines = text.split('\n');
  lines.forEach(line => {
    players.push(player)
  });
  return players;
};

const savePlayersToDatabase = (players) => {
  return Player.insertMany(players);
};

module.exports = {
  handleFileUpload,
}