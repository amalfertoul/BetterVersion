import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../slices/UserSlice';
import { setSearchQuery, clearSearchQuery } from '../slices/taskSlice';
import '../style/sidebar.css';

const Sidebar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  const isAuthenticated = useSelector((state) => state.users.isAuthenticated);
  const searchQuery = useSelector((state) => state.tasks.searchQuery);
  const [prevAuthState, setPrevAuthState] = useState(isAuthenticated);

  useEffect(() => {
    setPrevAuthState(isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    if (location.pathname !== '/home') {
      dispatch(clearSearchQuery());
    }
  }, [location.pathname, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark');
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    if (location.pathname === '/home') {
      dispatch(setSearchQuery(query));
    }
  };

  const allRoutes = [
    { path: '/home', icon: 'bx-home-alt', text: 'Home' },
    { path: '/explore', icon: 'bx-compass', text: 'Explore' },
    { path: '/games', icon: 'bx-game', text: 'Games', requiresAuth: true },
    { path: '/socialize', icon: 'bx-message-square-dots', text: 'Socialize', requiresAuth: true },
    { path: '/profile', icon: 'bx-user', text: 'Profile', requiresAuth: true },
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
              <input 
                type="text" 
                placeholder={location.pathname === '/home' ? "Search tasks..." : "Search..."}
                value={searchQuery}
                onChange={handleSearch}
              />
            </li>
          )}

          <ul className="menu-links">
            {allRoutes.map((route) => (
              <li 
                className={`nav-link ${location.pathname === route.path ? 'active' : ''} 
                  ${route.requiresAuth && !isAuthenticated ? 'hidden' : ''}`} 
                key={route.path}
              >
                <Link to={route.path}>
                  <i className={`bx ${route.icon} icon`}></i>
                  <span className="text nav-text">{route.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="bottom-content">
          {isAuthenticated ? (
            <li>
              <a href="#" onClick={handleLogout}>
                <i className='bx bx-log-out icon'></i>
                <span className="text nav-text">Logout</span>
              </a>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login">
                  <i className='bx bx-log-in icon'></i>
                  <span className="text nav-text">Login</span>
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <i className='bx bx-user-plus icon'></i>
                  <span className="text nav-text">Register</span>
                </Link>
              </li>
            </>
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