import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages, sendMessage, deleteMessage } from '../slices/messageSlice';
import { motion, AnimatePresence } from 'framer-motion';
import '../style/conversation.css'; // Ensure you have the correct path to your CSS file
const RenderMessages = () => {
    const dispatch = useDispatch();
    const { userId } = useParams();
    const [newMessage, setNewMessage] = useState('');
    const [showDeleteButton, setShowDeleteButton] = useState(null);
    const [contactName, setContactName] = useState('Contact');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    const { messages, status, error } = useSelector((state) => state.messages);
    const currentUserId = useSelector((state) => state.users.user?.id);
    const users = useSelector((state) => state.users.users);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        dispatch(fetchMessages(userId));
    }, [dispatch, userId]);

    // Get contact name
    useEffect(() => {
        if (users && userId) {
            const contact = users.find(user => user.id === parseInt(userId));
            if (contact) {
                setContactName(contact.fullname || 'Contact');
            }
        }
    }, [users, userId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && !isSending) {
            setIsSending(true);
            const messageData = {
                sender_id: currentUserId,
                receiver_id: parseInt(userId),
                content: newMessage,
                type: 'text',
                active_scope: 'private',
                timestamp: new Date().toISOString(),
            };

            dispatch(sendMessage(messageData))
                .unwrap()
                .then(() => {
                    setNewMessage('');
                })
                .catch((err) => {
                    console.error('Failed to send message:', err);
                })
                .finally(() => {
                    setIsSending(false);
                });
        }
    };

    const handleDeleteMessage = (messageId) => {
        dispatch(deleteMessage(messageId))
            .unwrap()
            .then(() => {
                setShowDeleteButton(null);
            })
            .catch((err) => {
                console.error('Failed to delete message:', err);
            });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const filteredMessages = messages
        .filter(
            (message) =>
                (message.sender_id === currentUserId && message.receiver_id === parseInt(userId)) ||
                (message.sender_id === parseInt(userId) && message.receiver_id === currentUserId)
        )
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (status === 'loading') {
        return (
            <div className="iphone-container">
                <div className="iphone-header">
                    <div className="iphone-status-bar">
                        <span>9:41</span>
                        
                    </div>
                    <div className="chat-header">
                        <button className="back-button" onClick={() => window.history.back()}>←</button>
                        <div className="contact-info">
                            <div className="skeleton-avatar"></div>
                            <div className="skeleton-name"></div>
                        </div>
                    </div>
                </div>
                
                <div className="messages-container">
                    {[...Array(6)].map((_, i) => (
                        <div 
                            key={i} 
                            className={`skeleton-message ${i % 2 === 0 ? 'skeleton-sent' : 'skeleton-received'}`}
                        >
                            <div className="skeleton-content"></div>
                        </div>
                    ))}
                </div>
                
                <div className="message-input-container">
                    <div className="skeleton-input"></div>
                    <div className="skeleton-send-button"></div>
                </div>
                
                <div className="iphone-footer">
                    <div className="home-indicator"></div>
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="iphone-container">
                <div className="iphone-header">
                    <div className="iphone-status-bar">
                       
                    </div>
                    <div className="chat-header">
                        <button className="back-button" onClick={() => window.history.back()}>←</button>
                        <h1>Error</h1>
                    </div>
                </div>
                
                <div className="error-screen">
                    <div className="error-icon">⚠️</div>
                    <h2>Error Loading Messages</h2>
                    <p>{error?.message || 'An error occurred'}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
                
                <div className="iphone-footer">
                    <div className="home-indicator"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="iphone-container">
            <div className="iphone-header">
                <div className="iphone-status-bar">
                   
                </div>
                <div className="chat-header">
                    <button className="back-button" onClick={() => window.history.back()}>←</button>
                    
                    <div className="contact-info">
                        <div className="contact-avatar">
                            {contactName.charAt(0)}
                        </div>
                        <div className="contact-details">
                            <h2>{contactName}</h2>
                            <p>Online</p>
                        </div>
                    </div>
                    
                    <div className="header-actions">
                       
                    </div>
                </div>
            </div>
            
            <div className="messages-container">
                <div className="date-indicator">
                    <span>Today</span>
                </div>
                
                <AnimatePresence>
                    {filteredMessages.map((message) => {
                        const isSent = message.sender_id === currentUserId;
                        
                        return (
                            <motion.div
                                key={message.id}
                                className={`message-bubble ${isSent ? 'sent' : 'received'}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                onDoubleClick={() => isSent && setShowDeleteButton(message.id)}
                                whileTap={{ scale: isSent ? 0.98 : 1 }}
                            >
                                <div className="bubble-content">
                                    <p>{message.content}</p>
                                    <span className="timestamp">{formatTime(message.timestamp)}</span>
                                </div>
                                
                                {showDeleteButton === message.id && isSent && (
                                    <motion.button
                                        className="delete-button"
                                        onClick={() => handleDeleteMessage(message.id)}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        ✕
                                    </motion.button>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
            </div>
            
            <div className="message-input-container">
                
                
                <div className="text-input-container">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Message"
                        onKeyPress={handleKeyPress}
                        rows={1}
                    />
                </div>
                
                <motion.button
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSending}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isSending ? (
                        <div className="sending-indicator"></div>
                    ) : (
                        <span>↑</span>
                    )}
                </motion.button>
            </div>
            
           
        </div>
    );
};

export default RenderMessages;