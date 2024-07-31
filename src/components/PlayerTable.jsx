import React, { useEffect, useState } from "react";
import PlayerComponent from "./PlayerComponent";

const PlayerTable = ({ refreshFlag }) => {
  const [players, setPlayers] = useState([]);

  const fetchPlayers = () => {
    fetch('http://localhost:5000/upload/players')
      .then(response => response.json())
      .then(data => setPlayers(data))
      .catch(error => console.error('Error:', error));
  }

  useEffect(() => {
    fetchPlayers();
  }, [refreshFlag]);

  const handleDraftChange = () => {
    fetchPlayers();
  };

  return (
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
        {players.map(player => (
          <PlayerComponent key={player._id} player={player} onDraftChange={handleDraftChange} />
        ))}
      </tbody>
    </table>
  );
};

export default PlayerTable;
