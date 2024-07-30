const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const uploadController = require('../controllers/uploadController');

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
  const filetypes = /pdf|vnd.openxmlformats-officedocument.spreadsheetml.sheet/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true); 
  } else {
    cb(new Error('Unsupported file type')); 
  }
};

// Create a multer instance with storage and fileFilter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.post('/', upload.single('file'), uploadController.handleFileUpload);

module.exports = router;