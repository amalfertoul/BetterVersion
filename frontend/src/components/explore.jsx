import React, { useEffect, useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchImages, createImage, deleteImage, updateImage } from '../slices/imagesSlice';

const Explore = () => {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images.images);
  const loading = useSelector((state) => state.images.loading);
  const error = useSelector((state) => state.images.error);
  const userId = useSelector((state) => state.users.userId);

  // Pour le filtre
  const [filter, setFilter] = useState('');
  // Pour l'ajout
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  // Pour l'édition
  const [editId, setEditId] = useState(null);
  const [editUrl, setEditUrl] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  // Ajout d'image
  const handleAddImage = (e) => {
    e.preventDefault();
    if (!userId) {
      alert("Vous devez être connecté pour ajouter une image.");
      return;
    }
    dispatch(createImage({
      url: newUrl,
      description: newDesc,
      user_id: userId,
      category_id: 1
    }));
    setShowAdd(false);
    setNewUrl('');
    setNewDesc('');
  };

  // Suppression d'image
  const handleDelete = (id) => {
    if (window.confirm('Supprimer cette image ?')) {
      dispatch(deleteImage(id));
    }
  };

  // Préparation édition
  const handleEdit = (img) => {
    setEditId(img.id);
    setEditUrl(img.url);
    setEditDesc(img.description);
  };

  // Validation édition
  const handleUpdateImage = (e) => {
    e.preventDefault();
    dispatch(updateImage({
      id: editId,
      imageData: {
        url: editUrl,
        description: editDesc,
        user_id: userId,
        category_id: 1
      }
    }));
    setEditId(null);
    setEditUrl('');
    setEditDesc('');
  };

  // Filtrage
  const filteredImages = images.filter(img =>
    img.description?.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div className="loading-message">Chargement des images...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="explore-container">
      <h1 className="explore-title">Galerie d'Images</h1>

      {/* Filtre */}
      <input
        type="text"
        placeholder="Filtrer par description..."
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
          <form onSubmit={handleAddImage} className="modal-form">
            <h3>Ajouter une image</h3>
            <input
              type="text"
              placeholder="URL de l'image"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              required
            />
            <button type="submit">Ajouter</button>
            <button type="button" onClick={() => setShowAdd(false)}>Annuler</button>
          </form>
        </div>
      )}

      {/* Modal édition */}
      {editId && (
        <div className="modal">
          <form onSubmit={handleUpdateImage} className="modal-form">
            <h3>Modifier l'image</h3>
            <input
              type="text"
              placeholder="URL de l'image"
              value={editUrl}
              onChange={e => setEditUrl(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
              required
            />
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={() => setEditId(null)}>Annuler</button>
          </form>
        </div>
      )}

      <div className="images-grid">
        {filteredImages.map((image, index) => (
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
              <button
                className="save-button"
                onClick={() => handleSave(image)}
              >
                Save
              </button>
              <button
                className="edit-button"
                onClick={() => handleEdit(image)}
                style={{ marginLeft: 5 }}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(image.id)}
                style={{ marginLeft: 5, color: 'red' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
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