import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import PlayerTable from "./components/PlayerTable";

const App = () => {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadKey, setUploadKey] = useState(0); // Key to force re-mounting

  const handleUploadSuccess = () => {
    setUploadSuccess(true);
    setUploadKey(prevKey => prevKey + 1); // Update key to re-mount PlayerTable
  };

  return (
    <div>
      <FileUpload onUploadSuccess={handleUploadSuccess} />
      {uploadSuccess && <PlayerTable key={uploadKey} />}
    </div>
  );
};

export default App;