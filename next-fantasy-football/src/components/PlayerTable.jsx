"use client";

import React, { useEffect, useState } from "react";
import PlayerComponent from "./PlayerComponent";

// Component to display the list of players in a table
const PlayerTable = ({ refreshFlag }) => {
  const [players, setPlayers] = useState([]);

  // Function to fetch the list of players from the BE
  const fetchPlayers = () => {
    fetch("/api/players")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPlayers(data.players);
        } else {
          console.error("Error fetching players:", data.error);
          setPlayers([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setPlayers([]);
      });
  };

  // Hook to fetch players whenever the refresh flag changes
  useEffect(() => {
    fetchPlayers();
  }, [refreshFlag]);

  // Handle changes in draft status and refresh the players list
  const handleDraftChange = () => {
    fetchPlayers();
  };

  // Handle reseting of the player list to empty state
  const handleReset = () => {
    setPlayers([]);
  };

  return (
    <div className="overflow-x-auto">
      <button
        onClick={handleReset}
        className="px-4 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 mb-4"
      >
        Reset
      </button>
      <table className="w-full border-collapse mt-5 border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left border-b border-gray-300 font-semibold">
              Rank
            </th>
            <th className="p-3 text-left border-b border-gray-300 font-semibold">
              Name
            </th>
            <th className="p-3 text-left border-b border-gray-300 font-semibold">
              Position
            </th>
            <th className="p-3 text-left border-b border-gray-300 font-semibold">
              Position Rank
            </th>
            <th className="p-3 text-left border-b border-gray-300 font-semibold">
              Team
            </th>
            <th className="p-3 text-left border-b border-gray-300 font-semibold">
              Bye
            </th>
            <th className="p-3 text-left border-b border-gray-300 font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(players) &&
            players.map((player) => (
              // Render each player row using the PlayerComponent
              <PlayerComponent
                key={player.id}
                player={{
                  ...player,
                  team: player.team_name,
                  positionRank: player.positionRank,
                }}
                onDraftChange={handleDraftChange}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable;
