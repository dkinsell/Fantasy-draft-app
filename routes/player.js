const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// Endpoint for marking a player as drafted by the user
router.patch('/:id/draft/user', playerController.markPlayerAsDraftedByUser);

// Endpoint for marking a player as drafted by another player in the league
router.patch('/:id/draft/other', playerController.markPlayerAsDraftedByOther);

// Endpoint for reseting a players drafted status
router.patch('/:id/draft/reset', playerController.resetPlayerDraftStatus);

module.exports = router;
