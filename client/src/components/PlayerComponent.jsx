import React, { useState } from "react";

// PlayerComponent is each row in our table
const PlayerComponent = ({ player, onDraftChange }) => {
  // State to track if the player is drafted by the user
  const [draftedByUser, setDraftedByUser] = useState(
    player.draftedBy === "user"
  );
  // State to track if the player is drafted by someone other than the user
  const [draftedByOther, setDraftedByOther] = useState(
    player.draftedBy === "other"
  );

  // Function to handle a player being drafted by the user
  const handleDraftByUser = () => {
    fetch(`http://localhost:5000/player/${player.id}/draft/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ draftedBy: "user" }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setDraftedByUser(true);
          setDraftedByOther(false);
          onDraftChange();
        } else {
          console.error("Failed to update draft status:", data.error);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  // Function to handle a player being drafted by someone other than the user
  const handleDraftByOther = () => {
    fetch(`http://localhost:5000/player/${player.id}/draft/other`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ draftedBy: "other" }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setDraftedByUser(false);
          setDraftedByOther(true);
          onDraftChange();
        } else {
          console.error("Failed to update draft status:", data.error);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  // Function to reset the players draft status
  const handleResetDraft = () => {
    fetch(`http://localhost:5000/player/${player.id}/draft/reset`, {
      method: "PATCH",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setDraftedByUser(false);
          setDraftedByOther(false);
          onDraftChange();
        } else {
          console.error("Failed to reset draft status:", data.error);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  // Determine row class based on draft status
  const rowClass = draftedByUser
    ? "drafted-by-user"
    : draftedByOther
    ? "drafted-by-other"
    : "";

  return (
    <tr className={rowClass}>
      <td>{player.rank}</td>
      <td>{player.name}</td>
      <td>{player.position}</td>
      <td>{player.positionRank}</td>
      <td>{player.team}</td>
      <td>{player.bye}</td>
      <td>
        <button
          onClick={handleDraftByUser}
          disabled={draftedByUser || draftedByOther}
          className="draft-btn"
        >
          Draft by me
        </button>
        <button
          onClick={handleDraftByOther}
          disabled={draftedByUser || draftedByOther}
          className="draft-btn"
        >
          Draft by other
        </button>
        <button
          onClick={handleResetDraft}
          disabled={!draftedByUser && !draftedByOther}
          className="reset-btn"
        >
          Reset draft status
        </button>
      </td>
    </tr>
  );
};

export default PlayerComponent;
