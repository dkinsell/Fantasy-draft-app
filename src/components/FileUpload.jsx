import React, { useState } from 'react';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        onUploadSuccess(); // Notify parent component about successful upload
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload Document</button>
    </div>
  );
};

export default FileUpload;
