// const Player = require('../models/players');
const pool = require("../config/databaseConfig");

const playerDraftController = {};

const updatePlayerDraftStatus = async (id, draftedBy, next) => {
  const query = `
    UPDATE players 
    SET drafted = $1, draftedBy = $2
    WHERE id = $3 AND created_at = (
      SELECT MAX(created_at) FROM players
    )
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [!!draftedBy, draftedBy, id]);

    if (result.rows.length === 0) {
      return { success: false, message: "Player not found" };
    }

    return { success: true, player: result.rows[0] };
  } catch (err) {
    throw err;
  }
};

playerDraftController.markPlayerAsDraftedByUser = async (req, res, next) => {
  try {
    const result = await updatePlayerDraftStatus(req.params.id, "user");
    return res.status(result.success ? 200 : 404).json(result);
  } catch (err) {
    return next({
      log: "Error in playerController.markPlayerAsDraftedByUser",
      status: 500,
      message: { err: "Failed to mark player as drafted by user" },
    });
  }
};

playerDraftController.markPlayerAsDraftedByOther = async (req, res, next) => {
  try {
    const result = await updatePlayerDraftStatus(req.params.id, "other");
    return res.status(result.success ? 200 : 404).json(result);
  } catch (err) {
    return next({
      log: "Error in playerController.markPlayerAsDraftedByOther",
      status: 500,
      message: { err: "Failed to mark player as drafted by other" },
    });
  }
};

playerDraftController.resetPlayerDraftStatus = async (req, res, next) => {
  try {
    const result = await updatePlayerDraftStatus(req.params.id, null);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (err) {
    return next({
      log: "Error in playerController.resetPlayerDraftStatus",
      status: 500,
      message: { err: "Failed to reset player draft status" },
    });
  }
};

module.exports = playerDraftController;
