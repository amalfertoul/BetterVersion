import React, { useEffect, useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchImages, createImage } from '../slices/imagesSlice';
import { fetchCategories } from '../slices/categorySlice';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const images = useSelector((state) => state.images.images);
  const loading = useSelector((state) => state.images.loading);
  const error = useSelector((state) => state.images.error);
  const userId = useSelector((state) => state.users.userId);
  const categories = useSelector((state) => state.categories.categories);

  const [filter, setFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (!userId) {
      alert("Vous devez être connecté pour accéder à cette page.");
      navigate('/login');
      return;
    }
    dispatch(fetchImages());
    dispatch(fetchCategories());
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

  // Filtrage par nom de catégorie
  const filteredImages = images.filter(img => {
    const cat = categories.find(c => c.id === img.category_id);
    return cat && cat.name.toLowerCase().includes(filter.toLowerCase());
  });

  if (loading) return <div className="loading-message">Chargement des images...</div>;
  if (error) return <div className="error-message">{error}</div>;

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
                src={image.url}
                alt={image.title || 'Image'}
                style={{ width: '10%', height: 'auto' }}
              />
              <div className="image-info">
                <p className="image-description">{image.description}</p>
                <p style={{ fontSize: 12, color: '#888' }}>
                  Catégorie : {cat ? cat.name : 'Aucune'}
                </p>
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