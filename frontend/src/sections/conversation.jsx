import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchMessages, sendMessage, deleteMessage } from '../slices/messageSlice';

const RenderMessages = () => {
    const dispatch = useDispatch();
    const { userId } = useParams();
    const [newMessage, setNewMessage] = useState('');
    const [showDeleteButton, setShowDeleteButton] = useState(null); // Track which message shows the delete button

    const { messages, status, error } = useSelector((state) => state.messages);
    const currentUserId = useSelector((state) => state.users.user?.id);

    useEffect(() => {
        dispatch(fetchMessages(userId));
    }, [dispatch, userId]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
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
                    console.log('Message sent successfully');
                    setNewMessage('');
                })
                .catch((err) => {
                    console.error('Failed to send message:', err);
                });
        }
    };

    const handleDeleteMessage = (messageId) => {
        dispatch(deleteMessage(messageId))
            .unwrap()
            .then(() => {
                console.log('Message deleted successfully');
                setShowDeleteButton(null); // Hide the delete button after deletion
            })
            .catch((err) => {
                console.error('Failed to delete message:', err);
            });
    };

    if (status === 'loading') {
        return <p>Loading messages...</p>;
    }

    if (status === 'failed') {
        return (
            <div style={{ color: 'red' }}>
                <p>Error: {error?.message}</p>
                {error?.errors &&
                    Object.entries(error.errors).map(([field, messages]) =>
                        messages.map((msg, idx) => <p key={`${field}-${idx}`}>{field}: {msg}</p>)
                    )}
            </div>
        );
    }

    return (
        <div>
            <div>
                {messages
                    .filter(
                        (message) =>
                            (message.sender_id === currentUserId && message.receiver_id === parseInt(userId)) ||
                            (message.sender_id === parseInt(userId) && message.receiver_id === currentUserId)
                    )
                    .slice()
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                    .map((message) => (
                        <div
                            key={message.id}
                            style={{
                                display: 'flex',
                                justifyContent: message.sender_id === currentUserId ? 'flex-end' : 'flex-start',
                                marginBottom: '10px',
                            }}
                            onDoubleClick={() =>
                                message.sender_id === currentUserId ? setShowDeleteButton(message.id) : null
                            } // Show delete button on double-click for messages on the right
                        >
                            <div
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '10px',
                                    maxWidth: '60%',
                                    backgroundColor: message.sender_id === currentUserId ? '#e0f7fa' : '#f1f8e9',
                                    position: 'relative',
                                }}
                            >
                                <p style={{ margin: 0 }}>{message.content}</p>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: '0.8em',
                                        color: '#888',
                                        textAlign: 'right',
                                    }}
                                >
                                    {new Date(message.timestamp).toLocaleString()}
                                </p>
                                {showDeleteButton === message.id && (
                                    <button
                                        onClick={() => handleDeleteMessage(message.id)}
                                        style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '-10px',
                                            backgroundColor: '#ff4d4d',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '30px',
                                            height: '30px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        marginRight: '10px',
                    }}
                />
                <button
                    onClick={handleSendMessage}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default RenderMessages;