import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserById } from '../slices/UserSlice'; // Importer l'action pour récupérer un utilisateur
import { fetchMessages, deleteMessage, updateMessage } from '../slices/messageSlice'; // Importer les actions pour les messages

const Conversation = () => {
  const { userId } = useParams(); // Récupérer l'ID de l'utilisateur sélectionné depuis l'URL
  const dispatch = useDispatch();

  const selectedUser = useSelector((state) => state.users.user);
  const loadingUser = useSelector((state) => state.users.loading);
  const errorUser = useSelector((state) => state.users.error);

  // Récupérer les messages depuis le state Redux
  const { messages } = useSelector((state) => state.messages);
  const currentUserId = useSelector((state) => state.users.userId); // ID de l'utilisateur connecté

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    // Charger les informations de l'utilisateur sélectionné
    dispatch(fetchUserById(userId));

    // Charger les messages
    dispatch(fetchMessages());
  }, [dispatch, userId]);

  // Filtrer les messages entre l'utilisateur connecté et l'utilisateur sélectionné
  const conversationMessages = messages.filter(
    (message) =>
      (message.senderId === currentUserId && message.receiverId === parseInt(userId, 10)) ||
      (message.senderId === parseInt(userId, 10) && message.receiverId === currentUserId)
  );

  const handleDeleteMessage = (messageId) => {
    dispatch(deleteMessage(messageId));
  };

  const handleEditMessage = (messageId, content) => {
    setEditingMessageId(messageId);
    setEditedContent(content);
  };

  const handleSaveEdit = (messageId) => {
    dispatch(updateMessage({ id: messageId, content: editedContent }));
    setEditingMessageId(null);
    setEditedContent('');
  };

  if (loadingUser) {
    return <div>Chargement des informations de l'utilisateur...</div>;
  }

  if (errorUser) {
    return <div>Erreur : {errorUser}</div>;
  }

  return (
    <div className="conversation-container">
      <div className="conversation-header">
        <img
          src={selectedUser?.profileImage || 'https://via.placeholder.com/50'} // Remplacez par l'image réelle de l'utilisateur
          alt="User Profile"
          className="user-profile-image"
        />
        <div className="user-info">
          <h3>{selectedUser?.username || 'Nom d\'utilisateur'}</h3>
        </div>
      </div>

      <div className="messages-container">
        {conversationMessages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.senderId === currentUserId ? 'sent' : 'received'}`}
          >
            {editingMessageId === message.id ? (
              <div className="edit-message">
                <input
                  type="text"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(message.id)}>Enregistrer</button>
                <button onClick={() => setEditingMessageId(null)}>Annuler</button>
              </div>
            ) : (
              <>
                <p>{message.content}</p>
                {message.senderId === currentUserId && (
                  <div className="message-actions">
                    <button onClick={() => handleEditMessage(message.id, message.content)}>
                      Modifier
                    </button>
                    <button onClick={() => handleDeleteMessage(message.id)}>Supprimer</button>
                  </div>
                )}
              </>
            )}
            <small>{new Date(message.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>

      <form className="send-message-form">
        <input type="text" placeholder="Écrire un message..." />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
};

export default Conversation;