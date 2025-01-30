// I spent about 8 hours figuring out Multer for the file upload and it's very finicky.
// The whole app hinges on this page so iterate at your own risk!

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadController = require("../controllers/uploadController");
const Player = require("../models/players");

// Check if the upload directory exists and create it if it doesn't
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("Created uploads directory");
}

// Define where the files will be stored
const destination = (req, file, cb) => {
  cb(null, "uploads/");
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
  const allowedFileTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  // Log MIME type and extension. MIME is available automatically on the file object
  console.log("MIME type:", file.mimetype);
  console.log("File extension:", path.extname(file.originalname).toLowerCase());

  // Check mimetype to make sure it's allowed
  const isMimeTypeAllowed = allowedFileTypes.includes(file.mimetype);
  // Check extension to make sure it's allowed
  const isExtensionAllowed = /\.(pdf|xlsx)$/.test(
    path.extname(file.originalname).toLowerCase()
  );

  console.log("MIME type allowed:", isMimeTypeAllowed);
  console.log("Extension allowed:", isExtensionAllowed);

  // Alow the file if mimetype and extensions are valid
  if (isMimeTypeAllowed && isExtensionAllowed) {
    return cb(null, true);
  } else {
    // Throw and error if the file isn't supported
    cb(new Error("Unsupported file type"), false);
  }
};

// Create a multer instance with storage and fileFilter configurations
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Middleware to log each requests timestamp. Not necessary but used when debugging
router.use((req, res, next) => {
  console.log("Request received at:", new Date().toISOString());
  next();
});

// Route to handle file upload. Probably could move some functionality to controller but be careful.
router.post(
  "/",
  upload.single("file"),
  (req, res, next) => {
    // Confirm the file was uploaded with the supported type and pass to controller
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded or unsupported file type" });
    }
    console.log("File uploaded:", req.file);
    console.log("Request body:", req.body);
    next();
  },
  uploadController.handleFileUpload
);

// Route to get all the players from the DB. Probably could move some functionality to controller.
router.get("/players", (req, res, next) => {
  Player.find({})
    .then((players) => res.json(players)) // Return player list as JSON
    .catch((err) => next(err));
});

module.exports = router;
