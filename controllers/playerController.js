const Player = require('../models/players');

const playerController = {};

// Mark a player as drafted by the user
playerController.markPlayerAsDraftedByUser = (req, res, next) => {
  const { id } = req.params;
  const draftedByUser = true;

  // If drafted by user update their draftedByUser status to true
  Player.findByIdAndUpdate(id, { draftedByUser }, { new: true })
    .then((updatedPlayer) => {
      if (!updatedPlayer) {
        // If no player is found with the ID, return 404
        return res.status(404).json({ message: 'Player not found' });
      } else {
        // Return the updated player data
        return res.status(200).json(updatedPlayer);
      }
    })
    .catch((err) => {
      return next({
        // Handle errors that occur during update
        log: 'Error in playerController.markPlayerAsDraftedByUser',
        status: 500,
        message: { err: 'An error occurred while marking the player as drafted by user' },
      });
    });
};

// Mark a player as drafted by another player in the league
playerController.markPlayerAsDraftedByOther = (req, res, next) => {
  const { id } = req.params;
  const draftedByOther = true;

  // If drafted by someone other than the user, update their draftedByOther status to true
  Player.findByIdAndUpdate(id, { draftedByOther }, { new: true })
    .then((updatedPlayer) => {
      if (!updatedPlayer) {
        return res.status(404).json({ message: 'Player not found' });
      } else {
        return res.status(200).json(updatedPlayer);
      }
    })
    .catch((err) => {
      return next({
        log: 'Error in playerController.markPlayerAsDraftedByOther',
        status: 500,
        message: { err: 'An error occurred while marking the player as drafted by another player' },
      });
    });
};

// Reset a players drafted status
playerController.resetPlayerDraftStatus = (req, res, next) => {
  const { id } = req.params;

  // Update draftedBy to null which resets the previous draftedBy states to false
  Player.findByIdAndUpdate(id, { draftedBy: null }, { new: true })
    .then((updatedPlayer) => {
      if (!updatedPlayer) {
        return res.status(404).json({ message: 'Player not found' });
      } else {
        return res.status(200).json(updatedPlayer);
      }
    })
    .catch((err) => {
      return next({
        log: 'Error in playerController.resetPlayerDraftStatus',
        status: 500,
        message: { err: 'An error occurred while resetting the player draft status' },
      });
    });
};

module.exports = playerController;
