import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUsers } from '../slices/UserSlice';
import { fetchImages } from '../slices/imagesSlice';
import { fetchVisionBoards } from '../slices/visionBoardSlice';
import '../style/ProfileFriends.css';

const ProfileFriends = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.users);
  const images = useSelector(state => state.images.images);
  const visionBoards = useSelector(state => state.visionBoard.visionBoards);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchImages());
    dispatch(fetchVisionBoards());
  }, [dispatch]);

  const selectedUser = users.find(u => String(u.id) === String(id));
  const userImages = selectedUser
    ? images.filter(img => String(img.user_id) === String(selectedUser.id))
    : [];
  const userVisionBoards = visionBoards
    .filter(
      vb =>
        String(vb.user_id) === String(selectedUser?.id) &&
        (vb.visibility === true || vb.visibility === 1 || vb.visibility === "1")
    );

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

        {userVisionBoards.length > 0 && (
          <div className="friend-visionboards-section">
            <h4 className="visionboards-header">Public Vision Boards:</h4>
            <div className="friend-visionboards-list">
              {userVisionBoards.map(vb => (
                <div className="friend-visionboard-card" key={vb.id}>
                  <div className="vb-title">{vb.name}</div>
                  <div className="vb-meta">
                    <span className={`vb-visibility ${vb.visibility ? 'public' : 'private'}`}>
                      {vb.visibility ? 'Public' : 'Private'}
                    </span>
                    <span className="vb-date">
                      {new Date(vb.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {/* Optionnel : afficher les 3 premières images du vision board */}
                  <div className="vb-images-preview">
                    {images
                      .filter(img => img.vision_board_id === vb.id)
                      .slice(0, 3)
                      .map(img => (
                        <img
                          key={img.id}
                          src={img.url.startsWith('http') ? img.url : `http://127.0.0.1:8000/storage/${img.url}`}
                          alt={img.description}
                          className="vb-preview-img"
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileFriends;