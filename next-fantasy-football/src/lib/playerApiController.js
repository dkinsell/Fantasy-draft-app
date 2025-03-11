import pool from "./db";

export async function getAllPlayers() {
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
    return {
      success: true,
      players: result.rows || [],
      totalCount: parseInt(result.rows[0]?.total_count || 0),
      timestamp: result.rows[0]?.created_at,
    };
  } catch (err) {
    console.error("Error in getAllPlayers:", err);
    return { success: false, message: "Failed to fetch players" };
  }
}

export async function getServerSidePlayersData() {
  try {
    const playersData = await getAllPlayers();
    
    if (!playersData.success) {
      console.error("Failed to load players data");
      return []; // Return empty array instead of throwing
    }

    return playersData.players;
  } catch (error) {
    console.error("Error fetching server-side data:", error);
    return []; // Return empty array on error
  }
}
