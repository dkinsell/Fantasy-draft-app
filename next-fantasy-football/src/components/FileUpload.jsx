"use client";

import React, { useState } from "react";

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

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

  return (
    <div className="mb-5">
      <label
        htmlFor="file-upload"
        className="inline-block px-4 py-2.5 mr-2.5 border border-gray-300 rounded-md bg-blue-500 text-white cursor-pointer hover:bg-blue-700 transition-colors duration-300"
      >
        Choose File
      </label>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2.5 bg-blue-500 text-white rounded-md hover:opacity-80 transition-colors duration-300"
      >
        Upload Document
      </button>
    </div>
  );
};

export default FileUpload;
