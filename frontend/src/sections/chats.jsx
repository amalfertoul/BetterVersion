import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMessages } from '../slices/messageSlice'; 
import { fetchUsers } from '../slices/UserSlice';

const ChatsTesting = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { messages, status, error } = useSelector((state) => state.messages);
    const users = useSelector((state) => state.users.users);
    const currentUserId = useSelector((state) => state.users.user?.id);
    const [searchTerm, setSearchTerm] = useState('');
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
        
        return user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
               user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Sort chats by most recent message
    const sortedChats = [...filteredChats].sort((a, b) => {
        const lastMessageA = a[1].sort((x, y) => new Date(y.timestamp) - new Date(x.timestamp))[0];
        const lastMessageB = b[1].sort((x, y) => new Date(y.timestamp) - new Date(x.timestamp))[0];
        return new Date(lastMessageB.timestamp) - new Date(lastMessageA.timestamp);
    });

    return (
        <div className="chats-container">
            {/* Header */}
            <div className="chats-header">
                <div className="header-content">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="search-icon">🔍</div>
                    </div>
                </div>
            </div>
            
            {/* Chat List */}
            <div className="chats-list">
                {sortedChats.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">💬</div>
                        <h3>No Messages Yet</h3>
                        <p>Start a conversation with your friends</p>
                    </div>
                ) : (
                    sortedChats.map(([userId, messages]) => {
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
                            <div 
                                key={userId} 
                                className={`chat-item ${activeChat === userId ? 'active' : ''}`}
                                onClick={() => {
                                    handleChatClick(userId);
                                    setActiveChat(userId);
                                }}
                            >
                                <div className="avatar-container">
                                    <img 
                                        src={user.profile_picture 
                                            ? "http://127.0.0.1:8000/storage/" + user.profile_picture 
                                            : 'http://127.0.0.1:8000/storage/default-profile.png'} 
                                        alt={userName} 
                                        className="avatar"
                                    />
                                    {unreadCount > 0 && (
                                        <div className="unread-badge">{unreadCount}</div>
                                    )}
                                </div>
                                
                                <div className="chat-info">
                                    <div className="chat-header">
                                        <div className="user-name">{userName}</div>
                                        <div className="message-time">
                                            {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    
                                    <div className="last-message">
                                        {isCurrentUserSender ? 'You: ' : ''}
                                        {lastMessageText}
                                    </div>
                                    
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            
            {/* Bottom Navigation */}
           
        </div>
    );
};

export default ChatsTesting;