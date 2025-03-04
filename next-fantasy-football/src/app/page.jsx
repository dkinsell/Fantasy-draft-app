"use client";

import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import PlayerTable from "../components/PlayerTable";

export default function HomePage() {
  // State to manage when the player table should refresh
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Called on successful file upload to trigger refetching of player data.
  const handleUploadSuccess = () => {
    setRefreshFlag(!refreshFlag);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Upload Player Rankings</h2>
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Available Players</h2>
          <PlayerTable refreshFlag={refreshFlag} />
        </div>
      </div>
    </div>
  );
}
