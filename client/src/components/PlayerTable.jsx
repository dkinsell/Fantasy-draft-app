import React, { useEffect, useState } from "react";
import PlayerComponent from "./PlayerComponent";

// Component to display the list of players in a table
const PlayerTable = ({ refreshFlag }) => {
  const [players, setPlayers] = useState([]);

  // Function to fetch the list of players from the BE
  const fetchPlayers = () => {
    fetch("http://localhost:5000/api/players")
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
    <div className="table-container">
      <button onClick={handleReset} className="reset-btn">
        Reset
      </button>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Position</th>
            <th>Position Rank</th>
            <th>Team</th>
            <th>Bye</th>
            <th>Actions</th>
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
