import React from 'react';
import { Link } from 'react-router-dom';

const ProfileHeader = ({ currentUser, handleLogout }) => (
    <div className="profile-header">
        <h2>My Profile</h2>
        {currentUser ? (
            <button className="logout-btn" onClick={handleLogout}>
                Logout
            </button>
        ) : (
            <Link to="/register" className="register-link">
                Register
            </Link>
        )}
    </div>
);

export default ProfileHeader;