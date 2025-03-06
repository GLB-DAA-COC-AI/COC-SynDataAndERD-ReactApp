import React, { useState } from 'react';
import SshTunnelingModal from './SshTunnelingModal';
import './SetupSshTunnelingButton.css';

function SetupSshTunnelingButton() {
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSubmit = (formData) => {
    console.log('SSH Tunnel Setup Data:', formData);
    // You can now send the formData to your backend API to set up the tunnel.
    setShowModal(false);
  };

  return (
    <div className="ssh-button-container">
      <button className="ssh-tunnel-button" onClick={() => setShowModal(true)}>
        🔐 Setup SSH Tunneling (Optional)
      </button>
      {showModal && (
        <SshTunnelingModal
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}

export default SetupSshTunnelingButton;
