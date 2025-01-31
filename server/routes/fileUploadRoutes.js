const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerUploadMiddleware");
const fileUploadController = require("../controllers/fileUploadController");

// Middleware to log each requests timestamp. Not necessary but used when debugging
router.use((req, res, next) => {
  console.log("Request received at:", new Date().toISOString());
  next();
});

// Route to handle file upload
router.post(
  "/",
  upload.single("file"),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded or unsupported file type",
      });
    }
    next();
  },
  fileUploadController.handleFileUpload
);

module.exports = router;
