import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../slices/messageSlice'; // Assure-toi que tu importes bien la bonne action
import { setUserId } from '../slices/UserSlice';
import { Link } from 'react-router-dom';

const Chats = () => {
    const dispatch = useDispatch();
    // Récupérer les messages et l'état depuis Redux
    const { messages, status, error } = useSelector((state) => state.messages);
    const userId = useSelector((state) => state.users.userId);

    useEffect(() => {
        try {
            let storedUserId = localStorage.getItem('userId');
            if (!storedUserId) {
                storedUserId = '0'; 
                localStorage.setItem('userId', storedUserId);
            }
            dispatch(setUserId(Number(storedUserId)));

            if (userId) {
                console.log('Fetching messages for userId:', userId);
                dispatch(fetchMessages(userId)).catch((error) => {
                    console.error('Error fetching messages:', error);
                });
            }
        } catch (error) {
            console.error('Error in useEffect:', error);
        }
    }, [dispatch, userId]);

    console.log('Messages:', messages);
    console.log('User ID:', userId);
    //fonction lizadet bach  nfilter ela les messgae dyal user connecter
    const filteredMessages = Array.isArray(messages)
    ? messages.filter((message) => message.receiverId === userId)
    : [];
    return (
        <div>
            <h1>User ID:</h1>
            <p>{userId}</p>
            <h2>Messages Sent to You:</h2>
            {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                    <div key={message.id} className="message-card">
                        <Link to={`/conversation/${message.senderId}`} className="message-link">
                            <div className="profile">
                                <img
                                    src={message.senderImage || 'https://via.placeholder.com/50'}
                                    alt={message.senderName}
                                    className="profile-image"
                                />
                                <div className="profile-info">
                                    <h3>{message.senderName}</h3>
                                    <p className="message-content">{message.content}</p>
                                    <small className="timestamp">
                                        {new Date(message.timestamp).toLocaleString()}
                                    </small>
                                    </div>
                            </div>
                        </Link>
                    </div>
                ))
            ) : (
                <p>No messages available</p>
            )}
        </div>
    );
};

export default Chats;