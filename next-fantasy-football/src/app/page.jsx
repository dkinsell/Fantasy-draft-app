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
    <div>
      <FileUpload onUploadSuccess={handleUploadSuccess} />
      <PlayerTable refreshFlag={refreshFlag} />
    </div>
  );
}
