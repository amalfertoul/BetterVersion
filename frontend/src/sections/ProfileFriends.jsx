import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ProfileFriends = () => {
  const users = useSelector((state) => state.users.users);
  const images = useSelector((state) => state.images.images);

  const [selectedUser, setSelectedUser] = useState(null);

  // Quand on clique sur un username
  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  // Images postées par l'utilisateur sélectionné
  const userImages = selectedUser
    ? images.filter(img => img.user_id === selectedUser.id)
    : [];

  return (
    <div style={{ padding: 20 }}>
      <h2>Users</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map(user => (
          <li key={user.id} style={{ marginBottom: 10 }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1em'
              }}
              onClick={() => handleUserClick(user)}
            >
              {user.username}
            </button>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div style={{
          marginTop: 30,
          padding: 20,
          border: '1px solid #eee',
          borderRadius: 8,
          background: '#fafafa'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
            {selectedUser.avatar ? (
              <img
                src={selectedUser.avatar}
                alt="avatar"
                style={{ width: 60, height: 60, borderRadius: '50%', marginRight: 15 }}
              />
            ) : (
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: '#007bff',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                marginRight: 15
              }}>
                {selectedUser.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 22 }}>{selectedUser.username}</div>
            </div>
          </div>
          <h4>Images posted:</h4>
          {userImages.length === 0 ? (
            <div>No images posted.</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {userImages.map(img => (
                <div key={img.id} style={{ width: 120 }}>
                  <img
                    src={img.url}
                    alt={img.description}
                    style={{ width: '100%', borderRadius: 6 }}
                  />
                  <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{img.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileFriends;