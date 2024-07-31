import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import PlayerTable from './components/PlayerTable';

const App = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleUploadSuccess = () => {
    setRefreshFlag(!refreshFlag);
  };

  return (
    <div>
      <FileUpload onUploadSuccess={handleUploadSuccess} />
      <PlayerTable refreshFlag={refreshFlag} />
    </div>
  );
};

export default App;
