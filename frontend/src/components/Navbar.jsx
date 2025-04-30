import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/Navbar.css';
const Navbar = () => {
  const [hoverLogo, setHoverLogo] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link 
          to="/" 
          className="logo"
          onMouseEnter={() => setHoverLogo(true)}
          onMouseLeave={() => setHoverLogo(false)}
        >
          <span className="logo-text">
            <span className="logo-better">Better</span>
            <span className="logo-version">Version</span>
          </span>
          <span className={`logo-underline ${hoverLogo ? 'animate' : ''}`}></span>
        </Link>

        <div className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link register">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;