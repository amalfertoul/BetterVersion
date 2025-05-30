import React, { useEffect, useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchImages, createImage, addImageToVisionBoard } from '../slices/imagesSlice';
import { fetchCategories } from '../slices/categorySlice';
import { fetchVisionBoards } from '../slices/visionBoardSlice';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import '../style/Explore.css';

const Explore = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.users.user?.id);
  const navigate = useNavigate();
  const images = useSelector((state) => state.images.images);
  const loading = useSelector((state) => state.images.loading);
  const error = useSelector((state) => state.images.error);
  const categories = useSelector((state) => state.categories.categories);
  const visionBoards = useSelector((state) => state.visionBoard.visionBoards);
  const { showError, showInfo } = useNotification();

  const [filter, setFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showVisionBoardModal, setShowVisionBoardModal] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!userId) {
      showError('Please log in to access this feature');
      navigate('/login');
      return;
    }
    dispatch(fetchImages());
    dispatch(fetchCategories());
    dispatch(fetchVisionBoards());
  }, [dispatch, userId, navigate, showError]);

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!userId) {
      showError("You must be logged in to add an image.");
      return;
    }
    if (!newFile) {
      showError("Please select an image file.");
      return;
    }
    if (!newCategory) {
      showError("Please select a category.");
      return;
    }
    const formData = new FormData();
    formData.append('image', newFile);
    formData.append('description', newDesc);
    formData.append('user_id', userId);
    formData.append('category_id', newCategory);

    await dispatch(createImage(formData));
    setShowAdd(false);
    setNewFile(null);
    setNewDesc('');
    setNewCategory('');
  };

  const filteredImages = filter.trim() === ''
    ? images
    : images.filter(img => {
        const cat = categories.find(c => c.id === img.category_id);
        return cat && cat.name.toLowerCase().includes(filter.toLowerCase());
      });

  const userVisionBoards = visionBoards.filter(board => board.user_id === userId);

  const handleAddToVisionBoard = (imageId) => {
    setSelectedImageId(imageId);
    setShowVisionBoardModal(true);
  };

  const handleSelectVisionBoard = async (visionBoardId) => {
    await dispatch(addImageToVisionBoard({ id: selectedImageId, vision_board_id: visionBoardId }));
    setShowVisionBoardModal(false);
    setSelectedImageId(null);
    showInfo("Image ajoutée au vision board avec succès!");
  };

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Loading images...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-screen">
      <div className="error-icon">⚠️</div>
      <h3>Loading error</h3>
      <p>{typeof error === 'string' ? error : error.message || JSON.stringify(error)}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div className="explore-container">
      

      <div className="controls-section">
        <div className="search-container">
          {!showSearch ? (
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowSearch(true)}
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          ) : (
            <>
              <input
                type="text"
                placeholder="Search by category..."
                value={filter}
                autoFocus
                onBlur={() => setShowSearch(false)}
                onChange={e => setFilter(e.target.value)}
              />
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                style={{ cursor: 'pointer' }}
                onMouseDown={e => e.preventDefault()}
                onClick={() => setShowSearch(false)}
              >
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </>
          )}
        </div>
        
        <button className="add-button" onClick={() => setShowAdd(true)}>
          <span className="plus-icon">+</span>
        </button>
      </div>

      {/* Modal ajout */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleAddImage} className="modal-form" encType="multipart/form-data">
              <h3>Add a new image</h3>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Describe your image..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Select an image</label>
                <div className="file-upload">
                  <label className="file-label">
                    {newFile ? newFile.name : "Choose a file"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setNewFile(e.target.files[0])}
                      required
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">Add</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal pour choisir un vision board */}
      {showVisionBoardModal && (
        <div className="modal-overlay" onClick={() => setShowVisionBoardModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-form">
              <h3>Add to a vision board</h3>
              {userVisionBoards.length === 0 ? (
                <div className="empty-boards">
                  <p>You don't have any vision boards yet.</p>
                  <button className="create-btn">Create a new vision board</button>
                </div>
              ) : (
                <div className="boards-grid">
                  {userVisionBoards.map(board => (
                    <div 
                      key={board.id} 
                      className="board-card"
                      onClick={() => handleSelectVisionBoard(board.id)}
                    >
                      <div className="board-thumbnail"></div>
                      <h4>{board.name}</h4>
                    </div>
                  ))}
                </div>
              )}
              <div className="form-actions">
                <button className="cancel-btn" onClick={() => setShowVisionBoardModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="instagram-grid">
        {filteredImages.length > 0 ? (
          filteredImages.map((image, index) => {
            const cat = categories.find(c => c.id === image.category_id);
            return (
              <div 
                key={image.id} 
                className="insta-card"
                style={{ animationDelay: `${index * 0.02}s` }}
              >
                <div className="insta-image-wrapper">
                  <img
                    className="insta-image"
                    src={"http://127.0.0.1:8000/storage/"+image.url}
                    alt={image.title || 'Image'}
                  />
                  
                  <div className="insta-overlay">
                    <div className="insta-actions">
                      <button 
                        className="insta-menu-button"
                        onClick={(e) => toggleMenu(image.id, e)}
                      >
                        <span className="dot">•</span>
                        <span className="dot">•</span>
                        <span className="dot">•</span>
                      </button>
                      
                      {activeMenu === image.id && (
                        <div className="insta-menu-dropdown slide-up">
                          <button
                            className="menu-item"
                            onClick={() => {
                              closeMenu();
                              handleAddToVisionBoard(image.id);
                            }}
                          >
                            <svg className="menu-icon" viewBox="0 0 24 24">
                              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                            Add to vision board
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="insta-info">
                      <h4 className="insta-title">{image.description}</h4>
                      <span className="insta-category">{cat ? cat.name : 'None'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🖼️</div>
            <h3>No images found</h3>
            <p>Try another search or add new images</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;