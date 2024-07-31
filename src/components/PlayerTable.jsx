import { set } from "mongoose";
import React, { useEffect, useState } from "react";


const PlayerTable = () => {
  const [players, setPlayers] = useState([]);

  const fetchPlayers = () => {
    fetch('http://localhost:5000/upload/players')
    .then(response => {
      if (!response.ok) {
        throw new Error ('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setPlayers(data);
    })
    .catch(error => {
      console.error('There was an error fetching the players!', error);
    });
  }
  useEffect(() => {
    setPlayers([]);
    fetchPlayers();
  }, []);

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
        </tr>
      </thead>
      <tbody>
        {players.map((player, index) => (
          <tr key={index}>
            <td>{player.rank}</td>
            <td>{player.name}</td>
            <td>{player.position}</td>
            <td>{player.positionRank}</td>
            <td>{player.team}</td>
            <td>{player.bye}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PlayerTable;