import React, { useState } from 'react';
import './SshTunnelingModal.css';

function SshTunnelingModal({ onClose, onSubmit }) {
  const [dbType, setDbType] = useState('postgres');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('5432'); // default for Postgres
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [databaseName, setDatabaseName] = useState('');
  const [sshHost, setSshHost] = useState('');
  const [sshPort, setSshPort] = useState('22');
  const [sshKey, setSshKey] = useState(null);

  // Default ports based on database type
  const defaultPorts = {
    postgres: '5432',
    mysql: '3306',
    oracle: '1521',
  };

  const handleDbTypeChange = (e) => {
    const newType = e.target.value;
    setDbType(newType);
    setPort(defaultPorts[newType] || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create a data object that can be sent to your backend
    const formData = {
      dbType,
      host,
      port,
      username,
      password,
      databaseName,
      sshHost,
      sshPort,
      // Note: For files, you may need to handle differently (e.g., via FormData)
      sshKey,
    };
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Setup SSH Tunneling</h2>
        <form onSubmit={handleSubmit}>
          <label>Database Type:</label>
          <select value={dbType} onChange={handleDbTypeChange}>
            <option value="postgres">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="oracle">Oracle</option>
          </select>

          <label>Database Host:</label>
          <input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            required
          />

          <label>Database Port:</label>
          <input
            type="text"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            required
          />

          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Database Name:</label>
          <input
            type="text"
            value={databaseName}
            onChange={(e) => setDatabaseName(e.target.value)}
            required
          />

          <label>SSH Host:</label>
          <input
            type="text"
            value={sshHost}
            onChange={(e) => setSshHost(e.target.value)}
            required
          />

          <label>SSH Port:</label>
          <input
            type="text"
            value={sshPort}
            onChange={(e) => setSshPort(e.target.value)}
            required
          />

          <label>SSH Private Key (optional):</label>
          <input
            type="file"
            onChange={(e) => setSshKey(e.target.files[0])}
          />

          <div className="modal-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SshTunnelingModal;
