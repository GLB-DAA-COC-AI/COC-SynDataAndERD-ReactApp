// HeroSection.js
import React from "react";
import "./HeroSection.css";

function HeroSection({ onGetStartedClick }) {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Welcome to the QA Portal</h1>
        <p>Generate synthetic data and convert CSV to ERD with ease!</p>
        <button className="hero-btn" onClick={onGetStartedClick}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default HeroSection;
