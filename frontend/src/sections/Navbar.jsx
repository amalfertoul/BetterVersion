import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ userId }) => {
  return (
    <nav>
      <ul>
        {/* If there is no userId, show Login and Register links */}
        {!userId ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        ) : (
          // If userId exists, show navigation links for authenticated users
          <>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/explore">Explore</Link></li>
            <li><Link to={`/chats/${userId}`}>Chats</Link></li>
            <li><Link to={`/games/${userId}`}>Games</Link></li>
            <li><Link to='/profile'>Profile</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
