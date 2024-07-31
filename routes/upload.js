const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadController = require('../controllers/uploadController');
const Player = require ('../models/players');

// Make sure the
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Created uploads directory');
}

// Define where the files will be stored
const destination = (req, file, cb) => {
  cb(null, 'uploads/');
};

// Define how the files will be named
const filename = (req, file, cb) => {
  cb(null, `${Date.now()}-${file.originalname}`);
};

// Define the destination directory and naming convention for our files
const storage = multer.diskStorage({
  destination: destination,
  filename: filename,
});

// Define how the files will be filtered
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedFileTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

  // Log MIME type and extension
  console.log('MIME type:', file.mimetype);
  console.log('File extension:', path.extname(file.originalname).toLowerCase());

  // Check mimetype
  const isMimeTypeAllowed = allowedFileTypes.includes(file.mimetype);
  // Check extension
  const isExtensionAllowed = /\.(pdf|xlsx)$/.test(path.extname(file.originalname).toLowerCase());

  console.log('MIME type allowed:', isMimeTypeAllowed);
  console.log('Extension allowed:', isExtensionAllowed);

  if (isMimeTypeAllowed && isExtensionAllowed) {
    return cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false); // Updated error callback
  }
};


// Create a multer instance with storage and fileFilter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.use((req, res, next) => {
  console.log('Request received at:', new Date().toISOString());
  next();
});

router.post('/', upload.single('file'), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or unsupported file type' });
  }
  console.log('File uploaded:', req.file);
  next();
}, uploadController.handleFileUpload);

router.get('/players', (req, res, next) => {
  Player.find({})
    .then(players => res.json(players))
    .catch(err => next(err)); // Pass any errors to the global error handler
});

module.exports = router;