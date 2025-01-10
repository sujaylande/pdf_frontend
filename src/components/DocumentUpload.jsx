import React, { useState } from "react";
import axios from "axios";

const DocumentUpload = ({ onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [driveLink, setDriveLink] = useState(""); 
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 5) {
      alert("You can only upload up to 5 files at a time.");
      return;
    }
    setFiles(selectedFiles);
  };

  const handleDriveLinkChange = (event) => {
    setDriveLink(event.target.value);
  };

  const handleUpload = async () => {
    if (!files.length && !driveLink) {
      return alert("Please select files or provide a drive link.");
    }
  
    setUploading(true);
  
    try {
      if (files.length) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        const response = await axios.post("http://pdf-backend-mvdj.onrender.com/api/files/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        onUploadComplete(response.data.document);
        setFiles([]);
      }
  
      if (driveLink) {
        const response = await axios.post("http://pdf-backend-mvdj.onrender.com/api/files/upload-drive-link", { link: driveLink });
        onUploadComplete(response.data.document);
        setDriveLink("");
      }
    } catch (error) {
      console.error("Error uploading files:", error.message);
      alert("Failed to upload files or process drive link. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-gray-50">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="mb-2"
        accept=".pdf,.txt,.docx,.xlsx,.csv,.json,.html,.xml,.jpg,.jpeg,.png"
      />
      <input
        type="text"
        placeholder="Enter drive link"
        value={driveLink}
        onChange={handleDriveLinkChange}
        className="mb-2 w-full p-2 border rounded"
      />
      <button
        onClick={handleUpload}
        disabled={uploading || (!files.length && !driveLink)}
        className={`bg-green-500 text-white px-4 py-2 rounded ${
          uploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default DocumentUpload;

