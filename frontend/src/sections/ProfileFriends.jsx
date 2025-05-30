import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUsers } from '../slices/UserSlice';
import '../style/ProfileFriends.css';

const ProfileFriends = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.users);
  const images = useSelector(state => state.images.images);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const selectedUser = users.find(u => String(u.id) === String(id));
  const userImages = selectedUser
    ? images.filter(img => String(img.user_id) === String(selectedUser.id))
    : [];

  if (!selectedUser) return <div className="profile-container">User not found.</div>;

  return (
    <div className="profile-container">
      <button
        onClick={() => navigate('/socialize')}
        className="back-button"
        aria-label="Retour aux suggestions"
      >
        <span style={{ marginRight: 6 }}>←</span> Back
      </button>
      
      <div className="profile-card">
        <div className="user-info">
          {selectedUser.profile_picture ? (
            <img
              src={`http://127.0.0.1:8000/storage/${selectedUser.profile_picture}`}
              alt="avatar"
              className="avatar"
            />
          ) : (
            <div className="avatar-placeholder">
              {selectedUser.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="username">
            {selectedUser.username}
          </div>
        </div>

        <h4 className="images-header">Images posted:</h4>
        {userImages.length === 0 ? (
          <div className="no-images">No images posted yet</div>
        ) : (
          <div className="images-grid">
            {userImages.map((img, index) => (
              <div 
                key={img.id} 
                className="image-card"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <img
                  src={img.url.startsWith('http') ? img.url : `http://127.0.0.1:8000/storage/${img.url}`}
                  alt={img.description}
                  className="image-item"
                />
                <div className="image-description">
                  {img.description || 'No description'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileFriends;