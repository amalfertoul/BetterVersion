import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../slices/UserSlice';
import { createFriendRequest, sendFriendRequest } from '../slices/friendRequestSlice';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import '../style/Suggestions.css'
const Suggestions = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showSuccess, showError, showInfo } = useNotification();
    const users = useSelector((state) => state.users.users);
    const currentUserId = useSelector((state) => state.users.user?.id);
    const pendingRequests = useSelector((state) => state.friendRequests.pending);
    const acceptedRequests = useSelector((state) => state.friendRequests.accepted);
    const loading = useSelector((state) => state.users.loading);
    const error = useSelector((state) => state.users.error);
    const [hoveredButton, setHoveredButton] = useState(null);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleSendRequest = async (userId) => {
        try {
            showInfo('Sending friend request...');
            await dispatch(sendFriendRequest({ 
                sender_id: currentUserId, 
                receiver_id: userId,
                status: 'pending' 
            }));
            showSuccess('Friend request sent successfully!');
        } catch (error) {
            showError('Failed to send friend request. Please try again.');
        }
    };

    const filteredUsers = users
        .filter(user => user.id !== currentUserId)
        .slice(0, 30);

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading suggestions...</p>
        </div>
    );
    
    if (error) return (
        <div className="error-container">
            <p>Error loading suggestions: {error}</p>
            <button 
                className="retry-button"
                onClick={() => dispatch(fetchUsers())}
            >
                Try Again
            </button>
        </div>
    );

    const suggestionItems = filteredUsers
        .filter(user =>
            !pendingRequests.some(request =>
                (request.sender_id === currentUserId && request.receiver_id === user.id) ||
                (request.sender_id === user.id && request.receiver_id === currentUserId)
            )
        )
        .filter(user =>
            !acceptedRequests.some(request =>
                (request.sender_id === currentUserId && request.receiver_id === user.id) ||
                (request.sender_id === user.id && request.receiver_id === currentUserId)
            )
        );

    return (
        <div className="suggestions-container">
            <div className="suggestions-header">
                <h2>People You May Know</h2>
                <div className="header-actions">
                    <span>{suggestionItems.length} suggestions</span>
                </div>
            </div>

            {suggestionItems.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">👋</div>
                    <p>No suggestions available at the moment</p>
                    <small>Try again later or invite friends</small>
                </div>
            ) : (
                <div className="suggestions-grid">
                    {suggestionItems.map((user) => (
                        <div className="suggestion-card" key={user.id}>
                            <div className="user-info">
                                <img
                                    src={
                                        user.profile_picture
                                            ? "http://127.0.0.1:8000/storage/" + user.profile_picture
                                            : 'http://127.0.0.1:8000/storage/default-profile.png'
                                    }
                                    alt={user.username}
                                    className="user-avatar"
                                    onClick={() => navigate(`/profile-friend/${user.id}`)}
                                />
                                <div className="user-details">
                                    <h3 onClick={() => navigate(`/profile-friend/${user.id}`)}>
                                        {user.fullname}
                                    </h3>
                                    <p className="username">@{user.username}</p>
                                </div>
                            </div>
                            <button 
                                className="add-button"
                                onClick={() => handleSendRequest(user.id)}
                                onMouseEnter={() => setHoveredButton(user.id)}
                                onMouseLeave={() => setHoveredButton(null)}
                            >
                                {hoveredButton === user.id ? (
                                    <span>Send Request</span>
                                ) : (
                                    <>
                                        <span className="plus-icon">+</span>
                                        <span>Add Friend</span>
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Suggestions;