"use client";

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
    fetch(`/api/players/${player.id}/draft/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
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
    fetch(`/api/players/${player.id}/draft/other`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
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

  // Function to reset the player's draft status
  const handleResetDraft = () => {
    fetch(`/api/players/${player.id}/draft/reset`, {
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

  const rowClass = draftedByUser
    ? "bg-green-100 hover:bg-green-200 transition-colors duration-300"
    : draftedByOther
    ? "bg-red-100 hover:bg-red-200 transition-colors duration-300"
    : "bg-white hover:bg-gray-100 transition-colors duration-300";

  return (
    <tr className={rowClass}>
      <td className="p-3 border-b border-gray-200">{player.rank}</td>
      <td className="p-3 border-b border-gray-200">{player.name}</td>
      <td className="p-3 border-b border-gray-200">{player.position}</td>
      <td className="p-3 border-b border-gray-200">{player.positionrank}</td>
      <td className="p-3 border-b border-gray-200">{player.team}</td>
      <td className="p-3 border-b border-gray-200">{player.bye}</td>
      <td className="p-3 border-b border-gray-200">
        <button
          onClick={handleDraftByUser}
          disabled={draftedByUser || draftedByOther}
          className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
        >
          Draft by me
        </button>
        <button
          onClick={handleDraftByOther}
          disabled={draftedByUser || draftedByOther}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
        >
          Draft by other
        </button>
        <button
          onClick={handleResetDraft}
          disabled={!draftedByUser && !draftedByOther}
          className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset draft status
        </button>
      </td>
    </tr>
  );
};

export default PlayerComponent;
