const express = require("express");
const router = express.Router();
const playerApiController = require("../controllers/playerApiController");

// Get all players from latest upload
router.get("/players", playerApiController.getAllPlayers);

module.exports = router;
