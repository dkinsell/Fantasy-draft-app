import React, { useState } from 'react';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);

  // Event handler to update file state with the selected file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Event handler for file upload
  const handleFileUpload = () => {
    // Append our file to the FormData object
    const formData = new FormData();
    formData.append('file', file);

    // POST request to upload the file
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

  // Component that includes our file upload input and upload document button
  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload Document</button>
    </div>
  );
};

export default FileUpload;
