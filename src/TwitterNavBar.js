import React from 'react';
import './TwitterNavBar.css';

function TwitterNavBar({ activeTab, setActiveTab }) {
  return (
    <div className="twitter-nav">
      <div className="twitter-nav-items">
        <div
          className={`twitter-nav-item ${activeTab === 'csv' ? 'active' : ''}`}
          onClick={() => setActiveTab('csv')}
        >
          CSV to ERD Converter
        </div>
        <div
          className={`twitter-nav-item ${activeTab === 'synthetic' ? 'active' : ''}`}
          onClick={() => setActiveTab('synthetic')}
        >
          Synthetic Data Generator
        </div>
      </div>
    </div>
  );
}

export default TwitterNavBar;
