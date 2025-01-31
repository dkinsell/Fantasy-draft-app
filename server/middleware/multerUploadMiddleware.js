const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("Created uploads directory");
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

// File filter configuration
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const isMimeTypeAllowed = allowedFileTypes.includes(file.mimetype);
  const isExtensionAllowed = /\.(pdf|xlsx)$/.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (isMimeTypeAllowed && isExtensionAllowed) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

// Create multer instance
const multerUploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = multerUploadMiddleware;
