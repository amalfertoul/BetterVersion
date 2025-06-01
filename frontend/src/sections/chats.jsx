import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMessages } from '../slices/messageSlice'; 
import { fetchUsers } from '../slices/UserSlice';
import '../style/chats.css';

const ChatsTesting = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { messages, status, error } = useSelector((state) => state.messages);
    const users = useSelector((state) => state.users.users);
    const currentUserId = useSelector((state) => state.users.user?.id);
    const searchQuery = useSelector((state) => state.tasks.searchQuery);
    const [activeChat, setActiveChat] = useState(null);

    useEffect(() => {
        dispatch(fetchMessages());
        dispatch(fetchUsers());
    }, [dispatch]);

    if (status === 'loading') {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading messages...</p>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
                <button onClick={() => { dispatch(fetchMessages()); dispatch(fetchUsers()); }}>
                    Try Again
                </button>
            </div>
        );
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
        navigate(`/conversation/${userId}`);
    };

    // Filter chats based on search term
    const filteredChats = Object.entries(groupedMessages).filter(([userId, messages]) => {
        const user = users.find(u => String(u.id) === String(userId));
        if (!user) return false;
        
        return user.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) || 
               user.username?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Sort chats by most recent message
    const sortedChats = [...filteredChats].sort((a, b) => {
        const lastMessageA = a[1].sort((x, y) => new Date(y.timestamp) - new Date(x.timestamp))[0];
        const lastMessageB = b[1].sort((x, y) => new Date(y.timestamp) - new Date(x.timestamp))[0];
        return new Date(lastMessageB.timestamp) - new Date(lastMessageA.timestamp);
    });

    return (
        <div className="chats-container">
            <div className="chats-list">
                {sortedChats.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">💬</div>
                        <h3>No Messages Yet</h3>
                        <p>Start a conversation with your friends</p>
                    </div>
                ) : (
                    <table className="chats-table">
                        <tbody>
                            {sortedChats.map(([userId, messages]) => {
                                const user = users.find(u => String(u.id) === String(userId));
                                if (!user) return null;
                                
                                const userName = user.fullname || 'Unknown';
                                const username = user.username || 'unknown';
                                const lastMessage = messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                                const lastMessageText = lastMessage.content.length > 30 
                                    ? lastMessage.content.substring(0, 30) + '...' 
                                    : lastMessage.content;
                                const isCurrentUserSender = lastMessage.sender_id === currentUserId;
                                const unreadCount = messages.filter(m => 
                                    m.receiver_id === currentUserId && !m.read
                                ).length;
                                
                                return (
                                    <tr 
                                        key={userId} 
                                        className={`chat-item ${activeChat === userId ? 'active' : ''}`}
                                        onClick={() => {
                                            handleChatClick(userId);
                                            setActiveChat(userId);
                                        }}
                                    >
                                        <td className="user-cell">
                                            <div className="avatar-container">
                                                <img 
                                                    src={user.profile_picture 
                                                        ? "http://127.0.0.1:8000/storage/" + user.profile_picture 
                                                        : 'http://127.0.0.1:8000/storage/pfp/defaultpfp.jpg'} 
                                                    alt={userName} 
                                                    className="avatar"
                                                />
                                            </div>
                                            <div className="user-info">
                                                <p className="username">@{username}</p>
                                                <h3 className="user-name">{userName}</h3>
                                            </div>
                                        </td>
                                        <td className="message-cell">
                                            <div className="last-message large-message">
                                                {isCurrentUserSender ? 'You: ' : ''}
                                                {lastMessageText}
                                            </div>
                                        </td>
                                        <td className="time-cell">
                                            {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="status-cell">
                                            {unreadCount > 0 ? (
                                                <span className="unread-indicator">{unreadCount}</span>
                                            ) : (
                                                <span className="read-indicator">Read</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ChatsTesting;