const pool = require("../config/databaseConfig");

const playerApiController = {};

playerApiController.getAllPlayers = async (req, res, next) => {
  try {
    const query = `
      WITH latest_timestamp AS (
        SELECT MAX(created_at) as max_time 
        FROM players
      )
      SELECT 
        p.*,
        t.name as team_name,
        COUNT(*) OVER() as total_count
      FROM players p 
      LEFT JOIN teams t ON p.team_id = t.id
      WHERE p.created_at = (SELECT max_time FROM latest_timestamp)
      ORDER BY p.rank ASC;
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      players: result.rows || [],
      totalCount: parseInt(result.rows[0]?.total_count || 0),
      timestamp: result.rows[0]?.created_at,
    });
  } catch (err) {
    return next({
      log: "Error in apiController.getAllPlayers",
      status: 500,
      message: { err: "Failed to fetch players" },
    });
  }
};

module.exports = playerApiController;
