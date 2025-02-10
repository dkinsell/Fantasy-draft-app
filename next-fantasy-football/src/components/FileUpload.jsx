"use client";

import React, { useState } from "react";

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);

  // Event handler to update file state with the selected file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Event handler for file upload
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Upload failed: " + response.statusText);
      }
      const data = await response.json();
      onUploadSuccess(data);
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };

  // Component that includes our file upload input and upload document button
  return (
    <div className="file-input-container">
      <label htmlFor="file-upload" className="file-input-label">
        Choose File
      </label>
      <input
        id="file-upload"
        type="file"
        className="file-input"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload} className="upload-btn">
        Upload Document
      </button>
    </div>
  );
};

export default FileUpload;
