import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFriendRequests, deleteFriendRequest } from '../slices/friendRequestSlice';
import { fetchUsers } from '../slices/UserSlice';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../style/friendsList.css'; // Ensure you have the correct path to your CSS file

const FriendsList = () => {
    const dispatch = useDispatch();
    const currentUserId = useSelector((state) => state.users.user?.id);
    const users = useSelector((state) => state.users.users);
    const acceptedRequests = useSelector((state) => state.friendRequests.accepted);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    useEffect(() => {
        const loadData = async () => {
            try {
                await dispatch(fetchFriendRequests());
                await dispatch(fetchUsers());
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setTimeout(() => setLoading(false), 500);
            }
        };
        
        loadData();
    }, [dispatch]);

    const handleMessage = (friendId) => {
        navigate(`/conversation/${friendId}`);
    };

    const handleDelete = (requestId) => {
        dispatch(deleteFriendRequest(requestId));
    };

    // Show all accepted requests where current user is either sender or receiver
    const filteredRequests = acceptedRequests.filter(
        request => request.sender_id === currentUserId || request.receiver_id === currentUserId
    );
    
    // Filter friends based on search term
    const filteredFriends = filteredRequests.filter(request => {
        const friendId = request.sender_id === currentUserId ? request.receiver_id : request.sender_id;
        const friend = users.find(user => user.id === friendId);
        if (!friend) return false;
        
        return friend.fullname.toLowerCase().includes(searchTerm.toLowerCase()) || 
               friend.username.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="friends-page">
            {loading ? (
                <div className="loading-container">
                    <motion.div
                        className="spinner"
                        animate={{ 
                            rotate: 360,
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                            rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                            scale: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
                        }}
                    >
                        <div className="spinner-inner"></div>
                    </motion.div>
                    <p>Loading your friends...</p>
                </div>
            ) : (
                <motion.div 
                    className="friends-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <AnimatePresence>
                        {filteredFriends.map(request => {
                            const friendId = request.sender_id === currentUserId ? request.receiver_id : request.sender_id;
                            const friend = users.find(user => user.id === friendId);
                            
                            if (!friend) return null;
                            
                            return (
                                <motion.div
                                    key={request.id}
                                    className="friend-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="avatar-container" onClick={() => navigate(`/profile-friend/${friendId}`)}>
                                        <div className="status-indicator"></div>
                                        <img
                                            src={
                                                friend.profile_picture
                                                    ? "http://127.0.0.1:8000/storage/" + friend.profile_picture
                                                    : 'http://127.0.0.1:8000/storage/pfp/defaultpfp.jpg'
                                            }
                                            alt={friend.username}
                                            className="avatar"
                                        />
                                    </div>
                                    
                                    <div className="friend-info">
                                        <h3 onClick={() => navigate(`/profile-friend/${friendId}`)}>
                                            {friend.fullname}
                                        </h3>
                                        
                                        <div className="actions-container">
                                            <motion.button 
                                                className="action-button message-button"
                                                onClick={(e) => { e.stopPropagation(); handleMessage(friendId); }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                💬 Message
                                            </motion.button>
                                            <motion.button 
                                                className="action-button remove-button"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(request.id); }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                ✕ Remove
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default FriendsList;