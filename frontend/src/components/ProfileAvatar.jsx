import React from 'react';

const ProfileAvatar = ({ currentUser, handlePfpChange }) => {
    console.log('Profile Picture URL:', currentUser.profile_picture_url); // Debugging line

    return (
        <div className="profile-avatar">
            {currentUser.profile_picture_url ? (
                <img
                    src={`http://127.0.0.1:8000/storage/${currentUser.profile_picture_url}?t=${new Date().getTime()}`} // Cache-busting query parameter
                    alt="Profile"
                />
            ) : (
                <div className="default-avatar">
                    {currentUser.username?.charAt(0) || 'U'}
                </div>
            )}

            <input
                type="file"
                id="pfp-upload"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePfpChange}
            />
            <button className="change-pfp-btn" onClick={() => document.getElementById('pfp-upload').click()}>
                Change Profile Picture
            </button>
        </div>
    );
};

export default ProfileAvatar;