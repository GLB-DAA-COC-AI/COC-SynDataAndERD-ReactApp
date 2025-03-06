import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the updated styles

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo.png" alt="Company Logo" />
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/insights">Insights</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/signup">Join Us</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
