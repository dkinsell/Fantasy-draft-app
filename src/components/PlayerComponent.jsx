import React, { useState } from 'react';

// PlayerComponent is each row in our table
const PlayerComponent = ({ player, onDraftChange }) => {
  // State to track if the player is drafted by the user
  const [draftedByUser, setDraftedByUser] = useState(player.draftedBy === 'user');
  // State to track if the player is drafted by someone other than the user
  const [draftedByOther, setDraftedByOther] = useState(player.draftedBy === 'other');

  // Function to handle a player being drafted by the user
  const handleDraftByUser = () => {
    fetch(`http://localhost:5000/player/${player._id}/draft/user`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ draftedBy: 'user' }),
    })
      .then(response => response.json())
      .then(data => {
        setDraftedByUser(true); // Update state of drafted by user to true
        setDraftedByOther(false); // Ensure other draft status is reset
        onDraftChange(); // Notify parent component to refresh data
      })
      .catch(error => console.error('Error:', error));
  };
  // Function to handle a player being drafted by someone other than the user
  const handleDraftByOther = () => {
    fetch(`http://localhost:5000/player/${player._id}/draft/other`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ draftedBy: 'other' }),
    })
      .then(response => response.json())
      .then(data => {
        setDraftedByUser(false);
        setDraftedByOther(true);
        onDraftChange(); 
      })
      .catch(error => console.error('Error:', error));
  };
// Function to rest the players draft status
  const handleResetDraft = () => {
    fetch(`http://localhost:5000/player/${player._id}/draft/reset`, {
      method: 'PATCH',
    })
      .then(response => response.json())
      .then(data => {
        setDraftedByUser(false); // Reset user draft status
        setDraftedByOther(false); // Reset other draft status
        onDraftChange(); // Notify parent component to refresh data
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    // Change styling depending on draft status
    <tr style={{ backgroundColor: draftedByUser ? 'green' : draftedByOther ? 'yellow' : 'white' }}>
      <td>{player.rank}</td>
      <td>{player.name}</td>
      <td>{player.position}</td>
      <td>{player.positionRank}</td>
      <td>{player.team}</td>
      <td>{player.bye}</td>
      <td>
        <button onClick={handleDraftByUser} disabled={draftedByUser || draftedByOther}>
          Draft by Me
        </button>
        <button onClick={handleDraftByOther} disabled={draftedByUser || draftedByOther}>
          Draft by Other
        </button>
        <button onClick={handleResetDraft}>Reset Draft Status</button>
      </td>
    </tr>
  );
};

export default PlayerComponent;
