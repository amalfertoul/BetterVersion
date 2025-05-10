import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createVisionBoard, fetchVisionBoards } from '../slices/visionBoardSlice';
import { fetchImages } from '../slices/imagesSlice';


const CreateVisionBoard = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.users.userId);
  const images = useSelector((state) => state.images.images);
  const visionBoards = useSelector((state) => state.visionBoard.visionBoards);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchImages());
    dispatch(fetchVisionBoards());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!userId) {
      setError('You must be logged in to create a vision board');
      setIsSubmitting(false);
      return;
    }

    const visionBoardData = {
      name,
      visibility: visibility === 'public',
      user_id: userId
    };

    try {
      console.log('Creating vision board:', visionBoardData);
      const result = await dispatch(createVisionBoard(visionBoardData)).unwrap();

      if (result) {
        setName('');
        setVisibility('public');
        setShowForm(false);
        dispatch(fetchVisionBoards());
      }
    } catch (err) {
      console.error('Error creating vision board:', err);
      if (err.response?.data?.errors) {
        const errorMessages = Object.entries(err.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to create vision board');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Vision Boards</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create New Vision Board'}
        </button>
      </div>

      {showForm && (
        <div className="create-form">
          <h3>Create New Vision Board</h3>
          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
              <p>Please check the console for more details.</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                placeholder="Enter vision board name"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label>Visibility:</label>
              <select 
                value={visibility} 
                onChange={e => setVisibility(e.target.value)}
                className="visibility-select"
                disabled={isSubmitting}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Vision Board'}
            </button>
          </form>
        </div>
      )}

      <div className="vision-boards">
        <h3>Your Vision Boards</h3>
        <div className="boards-list">
          {visionBoards
            .filter(board => board.user_id === userId)
            .map(board => (
              <div key={board.id} className="board-item">
                <h4>{board.name}</h4>
                <span className="visibility-badge">
                  {board.visibility ? 'Public' : 'Private'}
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="images-grid">
        <h3>Available Images</h3>
        <div className="grid">
          {images.map((image) => (
            <div key={image.id} className="image-card">
              <img src={image.image_url} alt={image.title || 'vision'} />
              <div className="image-actions">
                <button >
save                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

       
    </div>
  );
};

export default CreateVisionBoard;