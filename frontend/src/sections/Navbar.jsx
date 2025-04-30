import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ userId }) => {
  return (
    <nav>
      <ul>
        {!userId ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/explore">Explore</Link></li>
            <li><Link to="/chats">Chats</Link></li>
            <li><Link to="/games">Games</Link></li>
            <li><Link to={`/profile/${userId}`}>Profile</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
