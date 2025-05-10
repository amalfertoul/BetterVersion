import React, { useEffect } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchImages, createImage } from '../slices/imagesSlice';

const Explore = () => {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images.images);
  const loading = useSelector((state) => state.images.loading);
  const error = useSelector((state) => state.images.error);
  
  // Récupération du userId depuis le state global
  const userId = useSelector((state) => state.users.userId);

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  const handleSave = (image) => {
 
    
    if (!userId) {
      alert("Vous devez être connecté pour sauvegarder une image.");
      return;
    }

    const imageData = {
      description: image.description,
      url: image.url,
      user_id: userId,
    category_id:1  };
    // hada gha bach kay3awni nchof dikchi f console
   // console.log("Image envoyée :", imageData); // 🔍 debug

    dispatch(createImage(imageData));
  };

  if (loading) {
    return <div className="loading-message">Chargement des images...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="explore-container">
      <h1 className="explore-title">Galerie d'Images</h1>
      
      <div className="images-grid">
        {images.map((image, index) => (
          <div 
            key={image.id} 
            className="image-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img
              className="image"
              src={image.url}
              alt={image.title || 'Image'}
            />
            <div className="image-info">
              <p className="image-description">{image.description}</p>
              <button
                className="save-button"
                onClick={() => handleSave(image)}
              >
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
