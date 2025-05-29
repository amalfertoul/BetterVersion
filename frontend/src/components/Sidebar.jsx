import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../slices/userSlice';
import '../style/sidebar.css';

const Sidebar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  const isAuthenticated = useSelector((state) => state.users.isAuthenticated);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark');
  };

  const routes = [
    { path: '/home', icon: 'bx-home-alt', text: 'Home' },
    { path: '/explore', icon: 'bx-compass', text: 'Explore' },
    { path: '/games', icon: 'bx-game', text: 'Games' },
    { path: '/socialize', icon: 'bx-message-square-dots', text: 'Socialize' },
    { path: '/profile', icon: 'bx-user', text: 'Profile' },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'close' : ''}`}>
      <header>
        <div className="image-text">
          <span className="image">
            <img 
              src={isAuthenticated && user?.profile_picture_url 
                ? "http://127.0.0.1:8000"+user.profile_picture_url 
                : 'http://127.0.0.1:8000/storage/pfp/defaultpfp.jpg'} 
              alt="Profile"
            />
          </span>
          <div className="text logo-text">
            <span className="name">
              {isAuthenticated && user ? user.username : 'Unknown Soul'}
            </span>
            <span className="profession">
              {isAuthenticated && user ? (user.isAdmin ? 'Admin' : 'Member') : 'Visitor'}
            </span>
          </div>
        </div>
        <i className='bx bx-chevron-right toggle' onClick={() => setIsCollapsed(!isCollapsed)}></i>
      </header>

      <div className="menu-bar">
        <div className="menu">
          {isAuthenticated && (
            <li className="search-box">
              <i className='bx bx-search icon'></i>
              <input type="text" placeholder="Search..." />
            </li>
          )}

          <ul className="menu-links">
            {routes.map((route) => (
              <li className={`nav-link ${location.pathname === route.path ? 'active' : ''}`} key={route.path}>
                <Link to={route.path}>
                  <i className={`bx ${route.icon} icon`}></i>
                  <span className="text nav-text">{route.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="bottom-content">
          {isAuthenticated && (
            <li>
              <a href="#" onClick={handleLogout}>
                <i className='bx bx-log-out icon'></i>
                <span className="text nav-text">Logout</span>
              </a>
            </li>
          )}

          <li className="mode">
            <div className="sun-moon">
              <i className='bx bx-moon icon moon'></i>
              <i className='bx bx-sun icon sun'></i>
            </div>
            <span className="mode-text text">{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
            <div className="toggle-switch" onClick={toggleDarkMode}>
              <span className="switch"></span>
            </div>
          </li>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 