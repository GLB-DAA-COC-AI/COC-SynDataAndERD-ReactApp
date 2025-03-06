import React, { useState } from 'react';
import axios from 'axios';
import './SyntheticData.css';
import SetupSshTunnelingButton from './SetupSshTunnelingButton';

function SyntheticData() {
  // --- Form states ---
  const [connectionString, setConnectionString] = useState('');
  const [dbOption, setDbOption] = useState('local_csv');
  const [selectedFile, setSelectedFile] = useState(null);
  const [numRows, setNumRows] = useState(10);
  const [context, setContext] = useState('');
  const [truncateAll, setTruncateAll] = useState(false);

  // --- UI states ---
  const [showSpinner, setShowSpinner] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [dbFilename, setDbFilename] = useState('');
  const [zipFile, setZipFile] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  // --- Preview states ---
  const [previewRows, setPreviewRows] = useState(1);
  const [previewData, setPreviewData] = useState(null);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- Base URL for Flask API ---
  const BASE_URL = 'http://18.159.211.125:8000';

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If the truncate-all checkbox is checked, ask for confirmation
    if (truncateAll) {
      const confirmed = window.confirm(
        'WARNING: You have chosen to truncate all rows in the external database.\n' +
        'This action is irreversible.\n\nDo you want to continue?'
      );
      if (!confirmed) {
        return; // User canceled, stop everything
      }
    }

    // Show spinner
    setShowSpinner(true);

    // Prepare form data
    const formData = new FormData();
    formData.append('connection_string', connectionString);
    formData.append('db_option', dbOption);
    formData.append('file', selectedFile);
    formData.append('num_rows', numRows);
    formData.append('context', context);
    if (truncateAll) {
      formData.append('truncate_db', 'true');
    }

    try {
      const response = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setShowSpinner(false);

      if (response.data.success) {
        // Clear any previous preview
        setPreviewVisible(false);
        setPreviewData(null);
        setSelectedPreviewFile('');

        // Update generated files info
        setGeneratedFiles(response.data.generated_files || []);
        setDbFilename(response.data.db_filename || '');
        setZipFile(response.data.zip_file || '');
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      setShowSpinner(false);
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.');
    }
  };

  // Preview a file
  const handlePreview = async (fileName) => {
    try {
      // Reset index whenever we start a new preview
      setCurrentIndex(0);
      setSelectedPreviewFile(fileName);

      // Fetch the preview (with default or current previewRows)
      const response = await axios.get(
        `${BASE_URL}/preview/${fileName}?num_rows=${previewRows}`
      );

      if (response.data.rows) {
        setPreviewData(response.data);
        setPreviewVisible(true);
      } else {
        alert(response.data.error || 'No rows available to preview.');
      }
    } catch (error) {
      console.error('Error previewing file:', error);
      alert('An error occurred while fetching preview data.');
    }
  };

  // Update the preview table based on existing selectedPreviewFile
  const handleUpdatePreview = async () => {
    if (!selectedPreviewFile) return;

    try {
      const response = await axios.get(
        `${BASE_URL}/preview/${selectedPreviewFile}?num_rows=${previewRows}`
      );
      if (response.data.rows) {
        setPreviewData(response.data);
        setPreviewVisible(true);
        setCurrentIndex(0); // Reset index on update
      } else {
        alert(response.data.error || 'No rows available to preview.');
      }
    } catch (error) {
      console.error('Error updating preview:', error);
      alert('An error occurred while updating the preview.');
    }
  };

  // Fetch next record
  const handleNext = async () => {
    if (!selectedPreviewFile) return;

    try {
      const response = await axios.get(
        `${BASE_URL}/next_preview/${selectedPreviewFile}/${currentIndex}`
      );
      if (response.data.row) {
        setPreviewData({
          header: response.data.header,
          rows: response.data.row,
        });
        setCurrentIndex(currentIndex + 1);
      } else {
        alert('No more rows available.');
      }
    } catch (error) {
      console.error('Error fetching next row:', error);
    }
  };

  // Fetch previous record
  const handlePrev = async () => {
    if (!selectedPreviewFile || currentIndex <= 0) return;

    try {
      const newIndex = currentIndex - 1;
      const response = await axios.get(
        `${BASE_URL}/next_preview/${selectedPreviewFile}/${newIndex}`
      );
      if (response.data.row) {
        setPreviewData({
          header: response.data.header,
          rows: response.data.row,
        });
        setCurrentIndex(newIndex);
      }
    } catch (error) {
      console.error('Error fetching previous row:', error);
    }
  };

  // Back to main
  const handleBackToMain = () => {
    // In a React app, you'd typically navigate with React Router
    // If you truly want to do a full page reload:
    window.location.href = '/';
  };

  return (
    <div className="synthetic-data-full-container">
      <header>
        <h1>SQLite Database Tool</h1>
        <p>Upload a database, generate synthetic data, and preview results!</p>
      </header>
      <div className="ssh-setup-container">
            <SetupSshTunnelingButton />
      </div>
      {/* Upload Form */}
      <section className="form-section">
        <form onSubmit={handleSubmit} className="upload-form">
          <label htmlFor="connection-string-input">Connection String (optional):</label>
          <input
            id="connection-string-input"
            type="text"
            name="connection_string"
            placeholder="e.g. postgresql+psycopg2://user:pw@host:5432/db"
            value={connectionString}
            onChange={(e) => setConnectionString(e.target.value)}
          />

          <label htmlFor="db-option-select">Database Option:</label>
          <select
            id="db-option-select"
            name="db_option"
            value={dbOption}
            onChange={(e) => setDbOption(e.target.value)}
          >
            <option value="local_csv">Local CSV and SQLite Only</option>
            <option value="aurora_postgres">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="mysql">Oracle</option>
          </select>
          

          <label htmlFor="file-input">Choose an SQLite Database:</label>
          <input
            id="file-input"
            type="file"
            name="file"
            accept=".db"
            required
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />

          <label htmlFor="row-input">Number of Rows to Generate:</label>
          <input
            id="row-input"
            type="number"
            name="num_rows"
            value={numRows}
            min="1"
            onChange={(e) => setNumRows(e.target.value)}
          />

          <label htmlFor="context-input">Additional Context (optional):</label>
          <textarea
            id="context-input"
            name="context"
            rows="4"
            placeholder="Provide any additional context here..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          ></textarea>

          <div className="truncate-container">
            <label>
              <input
                id="truncate-db"
                type="checkbox"
                name="truncate_db"
                checked={truncateAll}
                onChange={(e) => setTruncateAll(e.target.checked)}
              />
              Truncate all rows before inserting new synthetic data
            </label>
          </div>

          <button
            type="submit"
            className="btn primary"
          >
            Upload
          </button>
        </form>
      </section>

      {/* Loading Spinner */}
      {showSpinner && (
        <div id="loading-spinner" className="loading-spinner">
          <div className="spinner"></div>
          <p>Uploading and processing...</p>
        </div>
      )}

      {/* Generated Files Section */}
      {generatedFiles.length > 0 && (
        <section id="generated-files">
          <h2>Generated Files</h2>
          <ul id="generated-file-list">
            {generatedFiles.map((file) => (
              <li key={file}>
                <a
                  href={`${BASE_URL}/download/${file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download {file}
                </a>{' '}
                <button onClick={() => handlePreview(file)}>Preview Data</button>
              </li>
            ))}
          </ul>

          <div className="btn-container">
            {/* Download .db file */}
            {dbFilename && (
              <a
                id="download-db"
                className="btn secondary"
                href={`${BASE_URL}/download_db/${dbFilename}`}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                Download .db file
              </a>
            )}
            {/* Download all CSV as ZIP */}
            {zipFile && (
              <a
                id="download-all"
                className="btn secondary"
                href={`${BASE_URL}/download/${zipFile}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download All CSV
              </a>
            )}
          </div>
        </section>
      )}

      {/* Preview Section */}
      {previewVisible && previewData && (
        <section id="preview-container">
          <h2>Data Preview</h2>

          <label htmlFor="preview-rows-input">Number of Rows to Preview:</label>
          <input
            id="preview-rows-input"
            type="number"
            min="1"
            value={previewRows}
            onChange={(e) => setPreviewRows(e.target.value)}
          />
          <button
            id="preview-submit"
            className="btn primary"
            onClick={handleUpdatePreview}
          >
            Update Preview
          </button>

          {/* Data Table */}
          <div id="preview-table-container">
            <table id="preview-table" border="1">
              <thead>
                <tr id="data-header">
                  {previewData.header &&
                    previewData.header.map((col, index) => (
                      <th key={index}>{col}</th>
                    ))}
                </tr>
              </thead>
              <tbody id="data-body">
                {previewData.rows &&
                  previewData.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Next/Prev Row Buttons */}
          <div className="nav-buttons">
            <button id="prev-button" onClick={handlePrev} disabled={currentIndex <= 0}>
              Previous
            </button>
            <button id="next-button" onClick={handleNext}>
              Next
            </button>
          </div>

          {/* Back to Main Button */}
          <button
            id="back-to-main-button"
            className="btn tertiary"
            onClick={handleBackToMain}
          >
            Back to Main
          </button>
        </section>
      )}
    </div>
  );
}

export default SyntheticData;
