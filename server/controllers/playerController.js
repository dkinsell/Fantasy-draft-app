// const Player = require('../models/players');
const pool = require("../config/db");

const playerController = {};

// Mark a player as drafted by the user
playerController.markPlayerAsDraftedByUser = async (req, res, next) => {
  const { id } = req.params;

  const query = `
    UPDATE players 
    SET drafted = true, draftedBy = 'user'
    WHERE id = $1 AND created_at = (
      SELECT MAX(created_at) FROM players
    )
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    return res.status(200).json({
      success: true,
      player: result.rows[0],
    });
  } catch (err) {
    return next({
      log: "Error in playerController.markPlayerAsDraftedByUser",
      status: 500,
      message: {
        err: "An error occurred while marking the player as drafted by user",
      },
    });
  }
};

// Mark a player as drafted by another player in the league
playerController.markPlayerAsDraftedByOther = async (req, res, next) => {
  const { id } = req.params;

  const query = `
    UPDATE players 
    SET drafted = true, draftedBy = 'other'
    WHERE id = $1 AND created_at = (
      SELECT MAX(created_at) FROM players
    )
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    return res.status(200).json({
      success: true,
      player: result.rows[0],
    });
  } catch (err) {
    return next({
      log: "Error in playerController.markPlayerAsDraftedByOther",
      status: 500,
      message: {
        err: "An error occurred while marking the player as drafted by another player",
      },
    });
  }
};

// Reset a player's drafted status
playerController.resetPlayerDraftStatus = async (req, res, next) => {
  const { id } = req.params;

  const query = `
    UPDATE players 
    SET drafted = false, draftedBy = NULL
    WHERE id = $1 AND created_at = (
      SELECT MAX(created_at) FROM players
    )
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    return res.status(200).json({
      success: true,
      player: result.rows[0],
    });
  } catch (err) {
    return next({
      log: "Error in playerController.resetPlayerDraftStatus",
      status: 500,
      message: {
        err: "An error occurred while resetting the player draft status",
      },
    });
  }
};

module.exports = playerController;
