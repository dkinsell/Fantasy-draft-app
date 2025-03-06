"use client";
import React, { useEffect, useState } from "react";
import PlayerComponent from "./PlayerComponent";

const PlayerTable = ({ initialPlayers, refreshFlag }) => {
  const [players, setPlayers] = useState(initialPlayers);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("All");

  // Only fetch new data when refresh is triggered
  useEffect(() => {
    const fetchPlayers = async () => {
      if (!refreshFlag) return;
      
      setLoading(true);
      try {
        const response = await fetch("/api/players");
        const data = await response.json();
        
        if (data.success) {
          setPlayers(data.players);
        } else {
          console.error("Error fetching players:", data.error);
          setPlayers([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [refreshFlag]);

  // Handle reseting of the player list to empty state
  const handleReset = () => {
    if (confirm("Are you sure you want to reset the player list?")) {
      setPlayers([]);
    }
  };

  // Filter players based on search term and position
  const filteredPlayers = players.filter(player => {
    const nameMatch = player.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const positionMatch = positionFilter === "All" || player.position === positionFilter;
    return nameMatch && positionMatch;
  });

  // Get unique positions for the filter dropdown
  const positions = ["All", ...new Set(players.map(player => player.position).filter(Boolean))];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-sm hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Reset Draft
        </button>

        <div className="flex flex-1 flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input 
              type="search" 
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[150px]"
          >
            {positions.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400">
            {players.length === 0 ? "No players available. Please upload a file." : "No players match your search criteria."}
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4 rounded-tl-lg">
                  Rank
                </th>
                <th scope="col" className="p-4">
                  Name
                </th>
                <th scope="col" className="p-4">
                  Position
                </th>
                <th scope="col" className="p-4">
                  Position Rank
                </th>
                <th scope="col" className="p-4">
                  Team
                </th>
                <th scope="col" className="p-4">
                  Bye
                </th>
                <th scope="col" className="p-4 rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player) => (
                <PlayerComponent
                  key={player.id}
                  player={{
                    ...player,
                    team: player.team_name,
                    positionRank: player.positionrank,
                  }}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PlayerTable;
