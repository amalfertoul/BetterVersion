import React, { useEffect, useState } from "react";
import { useDispatch , useSelector } from "react-redux";
import { fetchFriendRequests , updateFriendRequest , deleteFriendRequest} from "../slices/friendRequestSlice";
import { fetchUsers } from "../slices/UserSlice"; 
import { motion, AnimatePresence } from "framer-motion";
import "../style/friendRequest.css"; // Ensure you have the correct path to your CSS file

const FriendRequest = () => {
    const dispatch = useDispatch(); 
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [hoveredCard, setHoveredCard] = useState(null);

    const currentUserId = useSelector((state) => state.users.user?.id);
    const { pending, status: requestStatus } = useSelector((state) => state.friendRequests);
    const users = useSelector((state) => state.users.users);

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

    // Filter received requests
    const receivedRequests = pending
        .filter(request => request.receiver_id === currentUserId)
        .map(request => {
            const sender = users.find(user => user.id === request.sender_id);
            return {
                id: request.id,
                sender_id: request.sender_id,
                sender_name: sender 
                    ? sender.first_name && sender.last_name 
                        ? `${sender.first_name} ${sender.last_name}`
                        : sender.fullname || "Unknown User"
                    : "Unknown User",
                username: sender?.username || "unknown",
                profile_picture: sender?.profile_picture || null
            };
        });
    
    // Filter requests based on search term
    const filteredRequests = receivedRequests.filter(request => 
        request.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        request.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const handleAccept = (id) => {
        dispatch(updateFriendRequest({ id, status: "accepted" }));
    };

    const handleDecline = (id) => {
        dispatch(deleteFriendRequest(id));
    };
    
    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
    };

    return (
        <div className="requests-page">
            <motion.div 
                className="requests-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="header-content">
                    <p>Manage your incoming connection requests</p>
                </div>
                
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-number">{receivedRequests.length}</div>
                        <div className="stat-label">Total Requests</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{filteredRequests.length}</div>
                        <div className="stat-label">Filtered</div>
                    </div>
                </div>
            </motion.div>
            
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
                    <p>Loading friend requests...</p>
                </div>
            ) : filteredRequests.length === 0 && requestStatus === 'succeeded' ? (
                <motion.div
                    className="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="empty-icon"
                        animate={{ 
                            y: [0, -10, 0],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        📭
                    </motion.div>
                    <h3>No Pending Requests</h3>
                    <p>You don't have any pending friend requests at the moment.</p>
                    <p className="suggestion">Check back later or connect with more people!</p>
                </motion.div>
            ) : (
                <motion.div 
                    className="requests-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <AnimatePresence>
                        {filteredRequests.map((request) => (
                            <motion.div
                                key={request.id}
                                className="request-card"
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                whileHover={{ y: -5 }}
                                onMouseEnter={() => setHoveredCard(request.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="user-info">
                                    <div className="avatar-container">
                                        <img
                                            src={
                                                request.profile_picture
                                                    ? "http://127.0.0.1:8000/storage/" + request.profile_picture
                                                    : 'http://127.0.0.1:8000/storage/default-profile.png'
                                            }
                                            alt={request.sender_name}
                                            className="avatar"
                                        />
                                        <div className="status-indicator"></div>
                                    </div>
                                    
                                    <div className="details">
                                        <h3>{request.sender_name}</h3>
                                        <p className="username">@{request.username}</p>
                                        <div className="request-time">Sent 2 days ago</div>
                                    </div>
                                </div>
                                
                                <div className="actions-container">
                                    <motion.button
                                        className="accept-button"
                                        onClick={() => handleAccept(request.id)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {hoveredCard === request.id ? "Accept Request" : "Accept"}
                                    </motion.button>
                                    <motion.button
                                        className="decline-button"
                                        onClick={() => handleDecline(request.id)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {hoveredCard === request.id ? "Decline Request" : "Decline"}
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default FriendRequest;