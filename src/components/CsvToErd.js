import React, { useState } from 'react';
import axios from 'axios';
import './CsvToErd.css';

function CsvToErd() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [erdUrl, setErdUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setLoading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('csv_file', file);
    });

    try {
      const response = await axios.post(
        'http://18.156.121.126:8000/generateERD',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setErdUrl(response.data.erd_url);
    } catch (error) {
      console.error('Error generating ERD:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="csv-to-erd">
      <h2>CSV to ERD Service</h2>
      <form onSubmit={handleSubmit}>
        <label>Select CSV Files:</label>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".csv" 
          multiple 
        />
        <button type="submit">Generate ERD</button>
      </form>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Uploading and processing...</p>
        </div>
      )}

      {erdUrl && (
        <div>
          <h3>Generated ERD:</h3>
          <img src={erdUrl} alt="Generated ERD" />
        </div>
      )}
    </div>
  );
}

export default CsvToErd;
