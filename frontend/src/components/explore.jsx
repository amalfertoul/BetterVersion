import React, { useEffect, useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchImages, createImage, addImageToVisionBoard } from '../slices/imagesSlice';
import { fetchCategories } from '../slices/categorySlice';
import { fetchVisionBoards } from '../slices/visionBoardSlice';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.users.user?.id);
  const navigate = useNavigate();
  const images = useSelector((state) => state.images.images);
  const loading = useSelector((state) => state.images.loading);
  const error = useSelector((state) => state.images.error);
  const categories = useSelector((state) => state.categories.categories);
  const visionBoards = useSelector((state) => state.visionBoard.visionBoards);

  const [filter, setFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showVisionBoardModal, setShowVisionBoardModal] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);

  useEffect(() => {
    if (!userId) {
      alert("Vous devez être connecté pour accéder à cette page.");
      navigate('/login');
      return;
    }
    dispatch(fetchImages());
    dispatch(fetchCategories());
    dispatch(fetchVisionBoards());
  }, [dispatch, userId, navigate]);

  // Ajout d'image avec fichier
  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("Vous devez être connecté pour ajouter une image.");
      return;
    }
    if (!newFile) {
      alert("Veuillez sélectionner un fichier image.");
      return;
    }
    if (!newCategory) {
      alert("Veuillez sélectionner une catégorie.");
      return;
    }
    const formData = new FormData();
    formData.append('file', newFile);
    formData.append('description', newDesc);
    formData.append('user_id', userId);
    formData.append('category_id', newCategory);

    await dispatch(createImage(formData));
    setShowAdd(false);
    setNewFile(null);
    setNewDesc('');
    setNewCategory('');
  };

  // Show all images if filter is empty, otherwise filter by category name
  const filteredImages = filter.trim() === ''
    ? images
    : images.filter(img => {
        const cat = categories.find(c => c.id === img.category_id);
        return cat && cat.name.toLowerCase().includes(filter.toLowerCase());
      });

  // Filter vision boards to only those created by the current user
  const userVisionBoards = visionBoards.filter(board => board.user_id === userId);

  // Handle add to vision board
  const handleAddToVisionBoard = (imageId) => {
    setSelectedImageId(imageId);
    setShowVisionBoardModal(true);
  };

  const handleSelectVisionBoard = async (visionBoardId) => {
    await dispatch(addImageToVisionBoard({ id: selectedImageId, vision_board_id: visionBoardId }));
    setShowVisionBoardModal(false);
    setSelectedImageId(null);
  };

  if (loading) return <div className="loading-message">Chargement des images...</div>;
if (error) return (
  <div className="error-message">
    {typeof error === 'string'
      ? error
      : error.message || JSON.stringify(error)}
  </div>
);
  return (
    <div className="explore-container">
      <h1 className="explore-title">Galerie d'Images</h1>

      {/* Filtre par nom de catégorie */}
      <input
        type="text"
        placeholder="Filtrer par nom de catégorie..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{ marginBottom: 20, padding: 6, width: 250 }}
      />

      {/* Bouton d'ajout */}
      <button onClick={() => setShowAdd(true)} style={{ marginLeft: 10, marginBottom: 20 }}>
        Ajouter une image
      </button>

      {/* Modal ajout */}
      {showAdd && (
        <div className="modal">
          <form onSubmit={handleAddImage} className="modal-form" encType="multipart/form-data">
            <h3>Ajouter une image</h3>
            <input
              type="file"
              accept="image/*"
              onChange={e => setNewFile(e.target.files[0])}
              required
            />
            <textarea
              placeholder="Description"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              required
            />
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button type="submit">Ajouter</button>
            <button type="button" onClick={() => setShowAdd(false)}>Annuler</button>
          </form>
        </div>
      )}

      {/* Modal pour choisir un vision board */}
      {showVisionBoardModal && (
        <div className="modal">
          <div className="modal-form">
            <h3>Choisir un vision board</h3>
            {userVisionBoards.length === 0 ? (
              <p>Vous n'avez pas encore de vision board.</p>
            ) : (
              userVisionBoards.map(board => (
                <button
                  key={board.id}
                  style={{ margin: '5px 0' }}
                  onClick={() => handleSelectVisionBoard(board.id)}
                >
                  {board.name}
                </button>
              ))
            )}
            <button type="button" onClick={() => setShowVisionBoardModal(false)}>Annuler</button>
          </div>
        </div>
      )}

      <div className="images-grid">
        {filteredImages.map((image, index) => {
          const cat = categories.find(c => c.id === image.category_id);
          return (
            <div 
              key={image.id} 
              className="image-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                className="image"
                src={"http://127.0.0.1:8000/storage/"+image.url}
                alt={image.title || 'Image'}
                style={{ width: '10%', height: 'auto' }}
              />
              <div className="image-info">
                <p className="image-description">{image.description}</p>
                <p style={{ fontSize: 12, color: '#888' }}>
                  Catégorie : {cat ? cat.name : 'Aucune'}
                </p>
                <button
                  style={{ marginTop: 8 }}
                  onClick={() => handleAddToVisionBoard(image.id)}
                >
                  Ajouter au vision board
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Styles modaux simples */}
      <style>{`
        .modal {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;
          z-index: 1000;
        }
        .modal-form {
          background: #fff; padding: 20px; border-radius: 8px; min-width: 300px;
          display: flex; flex-direction: column; gap: 10px;
        }
      `}</style>
    </div>
  );
};

export default Explore;