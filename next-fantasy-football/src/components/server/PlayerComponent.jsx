"use client";
import React, { useState } from "react";
import PlayerActions from "../client/PlayerActions";

const PlayerComponent = ({ player }) => {
  // Local state to track draft status
  const [draftStatus, setDraftStatus] = useState(player.draftedby || player.drafted_by);
  
  // Compute derived states
  const isDraftedByUser = draftStatus === "user";
  const isDraftedByOther = draftStatus === "other";

  // Function to handle draft status changes
  const handleDraftStatusChange = (status) => {
    setDraftStatus(status);
  };

  // Determine the row styling based on draft status
  const rowClass = isDraftedByUser
    ? "bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 transition-colors duration-300"
    : isDraftedByOther
    ? "bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors duration-300"
    : "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/70 transition-colors duration-300";

  // Determine status badge styling
  const statusBadge = isDraftedByUser ? (
    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
      <span className="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
      Drafted by you
    </span>
  ) : isDraftedByOther ? (
    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
      <span className="w-2 h-2 me-1 bg-red-500 rounded-full"></span>
      Drafted by others
    </span>
  ) : null;

  return (
    <tr className={rowClass}>
      <td className="p-3 border-b border-gray-200 dark:border-gray-700 font-medium">
        {player.rank}
      </td>
      <td className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-white">
            {player.name}
          </span>
          {statusBadge}
        </div>
      </td>
      <td className="p-3 border-b border-gray-200 dark:border-gray-700">
        <span className="px-2 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
          {player.position}
        </span>
      </td>
      <td className="p-3 border-b border-gray-200 dark:border-gray-700">{player.positionrank}</td>
      <td className="p-3 border-b border-gray-200 dark:border-gray-700">{player.team}</td>
      <td className="p-3 border-b border-gray-200 dark:border-gray-700">{player.bye}</td>
      <td className="p-3 border-b border-gray-200 dark:border-gray-700">
        <PlayerActions 
          player={player}
          isDraftedByUser={isDraftedByUser}
          isDraftedByOther={isDraftedByOther}
          onDraftStatusChange={handleDraftStatusChange}
        />
      </td>
    </tr>
  );
};

export default PlayerComponent;
