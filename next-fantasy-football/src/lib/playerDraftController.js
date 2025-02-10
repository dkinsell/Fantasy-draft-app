import pool from "./db";

export async function updatePlayerDraftStatus(id, draftedBy) {
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
    console.error("Error updating draft status:", err);
    throw err;
  }
}
