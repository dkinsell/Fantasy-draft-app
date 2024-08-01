import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import PlayerTable from './components/PlayerTable';

// Main component
const App = () => {
  // State to manage the refresh flag that is used to reload the player table
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Function that resets the refresh flag the player data is refetched
  const handleUploadSuccess = () => {
    setRefreshFlag(!refreshFlag);
  };

  // Components for file upload and player table
  return (
    <div>
      <FileUpload onUploadSuccess={handleUploadSuccess} />
      <PlayerTable refreshFlag={refreshFlag} />
    </div>
  );
};

export default App;
