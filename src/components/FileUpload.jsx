import React from "react";

const FileUpload = () => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log('File uploaded:', file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};

export default FileUpload;