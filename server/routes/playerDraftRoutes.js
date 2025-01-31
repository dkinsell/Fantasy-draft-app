const express = require("express");
const router = express.Router();
const playerDraftController = require("../controllers/playerDraftController");

// Draft status routes
router.patch(
  "/:id/draft/user",
  playerDraftController.markPlayerAsDraftedByUser
);
router.patch(
  "/:id/draft/other",
  playerDraftController.markPlayerAsDraftedByOther
);
router.patch("/:id/draft/reset", playerDraftController.resetPlayerDraftStatus);

module.exports = router;
