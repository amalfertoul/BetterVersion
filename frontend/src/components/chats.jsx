import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMessages} from '../slices/messageSlice';
const Chats = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Récupérer les messages depuis le state Redux
  const { messages, status, error } = useSelector((state) => state.messages);

  // Récupérer l'ID de l'utilisateur connecté
  const userId = useSelector((state) => state.users.userId);

  // Charger l'ID utilisateur depuis le localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      dispatch(setUserId(Number(storedUserId)));
    }
    // Charger les messages
    dispatch(fetchMessages());
  }, [dispatch]);

  // Filtrer les utilisateurs uniques ayant envoyé un message à l'utilisateur connecté
  const uniqueSenders = Array.isArray(messages)
    ? messages
        .filter((message) => message.receiverId === userId)
        .reduce((acc, message) => {
          if (!acc.some((sender) => sender.senderId === message.senderId)) {
            acc.push({
              senderId: message.senderId,
              senderName: message.senderName,
              senderImage: message.senderImage,
              lastMessage: message.content,
              timestamp: message.timestamp,
            });
          }
          return acc;
        }, [])
    : [];

  if (status === 'loading') {
    return <div>Chargement des messages...</div>;
  }

  if (status === 'failed') {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="chats-container">
      <h1>Messages</h1>
      <div className="users-list">
        {uniqueSenders.map((sender) => (
          <div
            key={sender.senderId}
            className="user-card"
            onClick={() => navigate(`/conversation/${sender.senderId}`)}
          >
            <img
              src={sender.senderImage || 'https://via.placeholder.com/50'}
              alt={sender.senderName}
              className="user-image"
            />
            <div className="user-info">
              <h3>{sender.senderName}</h3>
              <p className="last-message">{sender.lastMessage}</p>
              <small className="timestamp">
                {new Date(sender.timestamp).toLocaleString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;