import React, { useState } from "react";
import axios from "axios";

const UploadMedia = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");

   const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("media", file);

    try {
       const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setUploadSuccess(true);
        setError("");
        setPreview("");  
        setFile(null);  
      }
    } catch (err) {
      setError("Error uploading file");
      setUploadSuccess(false);
    }
  };

  return (
    <div className="upload-media-container">
      <h2>Upload Media</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select File:</label>
          <input type="file" onChange={handleFileChange} required />
        </div>
        {preview && (
          <div className="preview-container">
            <h3>Preview:</h3>
            <img src={preview} alt="File Preview" className="preview-image" />
          </div>
        )}
        <button type="submit">Upload</button>
      </form>
      {uploadSuccess && <div className="success-message">File uploaded successfully!</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default UploadMedia;
