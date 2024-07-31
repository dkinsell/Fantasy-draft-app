import React from "react";

const dummyPlayers = [
  { rank: 1, name: "Christian McCaffrey", position: "RB", team: "SF", bye: 9, positionRank: 1 },
  { rank: 2, name: "Breece Hall", position: "RB", team: "NYJ", bye: 12, positionRank: 2 },
  { rank: 3, name: "Derrick Henry", position: "RB", team: "BAL", bye: 14, positionRank: 3 },
  { rank: 4, name: "Saquon Barkley", position: "RB", team: "PHI", bye: 5, positionRank: 4 },
  { rank: 5, name: "Bijan Robinson", position: "RB", team: "ATL", bye: 12, positionRank: 5 }
];

const PlayerTable = () => {
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
        {dummyPlayers.map((player) => (
          <tr key={player.rank}>
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