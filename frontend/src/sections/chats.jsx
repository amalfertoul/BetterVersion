import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchMessages } from '../slices/messageSlice'; 
import { fetchUsers } from '../slices/UserSlice';

const ChatsTesting = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate
    const { messages, status, error } = useSelector((state) => state.messages);
    const users = useSelector((state) => state.users.users);
    const currentUserId = useSelector((state) => state.users.userId);

    useEffect(() => {
        dispatch(fetchMessages());
        dispatch(fetchUsers());
    }, [dispatch]);

    if (status === 'loading') {
        return <div>Loading messages...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    const filteredMessages = messages.filter(
        (message) => message.sender_id === currentUserId || message.receiver_id === currentUserId
    );

    const groupedMessages = filteredMessages.reduce((acc, message) => {
        const otherUserId = message.sender_id === currentUserId ? message.receiver_id : message.sender_id;
        if (!acc[otherUserId]) {
            acc[otherUserId] = [];
        }
        acc[otherUserId].push(message);
        return acc;
    }, {});

    const handleChatClick = (userId) => {
        navigate(`/conversation/${userId}`); // Redirect to the conversation page with the user ID
    };

    return (
        <div>  
            {Object.keys(groupedMessages).length === 0 ? (
                <p>No messages found.</p>
            ) : (
                Object.entries(groupedMessages).map(([userId, messages]) => {
                    const userName = users.find((user) => String(user.id) === String(userId))?.fullname || 'Unknown';

                    return (
                        <div 
                            key={userId} 
                            onClick={() => handleChatClick(userId)} // Add onClick handler
                            style={{ cursor: 'pointer' }} // Add pointer cursor for better UX
                        >
                            <h2>
                                <img 
                                    src={users.find((user) => String(user.id) === String(userId))?.profile_picture || 'default-profile.png'} 
                                    alt='*' 
                                />
                                {userName}
                            </h2>
                            <ul>
                                {messages
                                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                    .slice(0, 1)
                                    .map((message) => (
                                        <li key={message.id}>
                                            <strong>{message.sender_id === currentUserId ? 'You' : userName}:</strong> {message.content} <br />
                                            <small>{new Date(message.timestamp).toLocaleString()}</small>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ChatsTesting;