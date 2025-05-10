import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../slices/UserSlice';
import { fetchImages, createImage, updateImage, deleteImage } from '../slices/imagesSlice';
import { fetchCategories } from '../slices/categorySlice';
import { fetchUserPerformance } from '../slices/userPerformanceSlice';
import { Link } from 'react-router-dom';

const Profile = () => {
    const dispatch = useDispatch();
    const currentUserId = useSelector((state) => state.users.userId);
    const users = useSelector((state) => state.users.users);
    const { images } = useSelector((state) => state.images);
    const { categories } = useSelector((state) => state.categories);
    const { 
        completedTasks, 
        incompletedTasks, 
        totalTasks, 
        completedPercentage, 
        performanceStatus,
        status: performanceStatusLoading 
    } = useSelector((state) => state.userPerformance);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingImage, setEditingImage] = useState(null);
    const [imageDescription, setImageDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    
    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchImages());
        dispatch(fetchCategories());
        dispatch(fetchUserPerformance());
    }, [dispatch]);

    // Find the current user's data
    const currentUser = users.find(user => user.id === currentUserId);
    
    // Filter images for current user
    const userImages = images.filter(img => img.user_id === currentUserId);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('Selected File:', {
                name: file.name,
                type: file.type,
                size: file.size
            });

            // Vérifier la taille du fichier (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setUploadError('File size must be less than 5MB');
                setSelectedFile(null);
                return;
            }

            // Vérifier le type de fichier
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setUploadError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
                setSelectedFile(null);
                return;
            }

            setSelectedFile(file);
            setUploadError('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !imageDescription.trim() || !selectedCategory) {
            setUploadError('Please provide a description, an image, and select a category');
            return;
        }

        setIsUploading(true);
        setUploadError('');

        try {
            // Créer un nouvel objet FormData
            const formData = new FormData();
            
            // Ajouter le fichier image
            formData.append('image', selectedFile);
            
            // Ajouter la description
            formData.append('description', imageDescription.trim());
            
            // Ajouter l'ID de l'utilisateur
            formData.append('user_id', currentUserId);

            // Ajouter l'ID de la catégorie
            formData.append('category_id', selectedCategory);

            // Log des données pour le débogage
            console.log('Upload Data:', {
                description: imageDescription.trim(),
                userId: currentUserId,
                url: selectedFile.type,
                fileSize: selectedFile.size,
                category_id: selectedCategory
            });

            // Envoyer la requête avec les bons headers
            const response = await dispatch(createImage(formData)).unwrap();
            console.log('Upload Response:', response);
            
            // Réinitialiser le formulaire après un upload réussi
            setSelectedFile(null);
            setImageDescription('');
            setSelectedCategory('');
            setShowUploadForm(false);
            setUploadError('');

            // Rafraîchir la liste des images
            dispatch(fetchImages());
        } catch (error) {
            console.error('Upload Error:', error);
            if (error.response) {
                // Erreur avec réponse du serveur
                const errorMessage = error.response.data.message || error.response.data.error || 'Failed to upload image';
                setUploadError(errorMessage);
            } else if (error.request) {
                // Pas de réponse du serveur
                setUploadError('No response from server. Please check your internet connection.');
            } else {
                // Erreur lors de la configuration de la requête
                setUploadError(`Error: ${error.message}`);
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpdate = async (imageId) => {
        if (!imageDescription.trim()) {
            setUploadError('Please provide a description');
            return;
        }

        try {
            await dispatch(updateImage({
                id: imageId,
                imageData: { description: imageDescription.trim() }
            })).unwrap();
            setEditingImage(null);
            setImageDescription('');
            setUploadError('');
        } catch (error) {
            console.error('Failed to update image:', error);
            setUploadError('Failed to update image. Please try again.');
        }
    };

    const handleDelete = async (imageId) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                await dispatch(deleteImage(imageId)).unwrap();
                setUploadError('');
            } catch (error) {
                console.error('Failed to delete image:', error);
                setUploadError('Failed to delete image. Please try again.');
            }
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h2>My Profile</h2>
                    <Link to="/friendsList" className="friends-link">
                        My Friends List
                    </Link>
                </div>
                
                {currentUser ? (
                    <div className="profile-content">
                        <div className="profile-avatar">
                            {currentUser.avatar ? (
                                <img src={currentUser.avatar} alt="Profile" />
                            ) : (
                                <div className="default-avatar">
                                    {currentUser.username?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>
                        
                        <div className="profile-info">
                            <div className="info-item">
                                <span>{currentUser.username || 'Not set'}</span>
                            </div>
                        </div>

                        {/* Performance Section */}
                        <div className="performance-section">
                            <h3>My Performance</h3>
                            {performanceStatusLoading === 'loading' ? (
                                <div className="loading">Loading performance data...</div>
                            ) : (
                                <div className="performance-stats">
                                    <div className="stat-item">
                                        <h4>Task Completion</h4>
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill"
                                                style={{ width: `${completedPercentage}%` }}
                                            ></div>
                                        </div>
                                        <p>{completedPercentage.toFixed(1)}% Completed</p>
                                    </div>
                                    
                                    <div className="stat-item">
                                        <h4>Performance Status</h4>
                                        <p className={`status ${performanceStatus.toLowerCase()}`}>
                                            {performanceStatus}
                                        </p>
                                        <div className="status-description">
                                            {performanceStatus === 'Excellent' && 
                                                'Great job! You\'re completing most of your tasks.'}
                                            {performanceStatus === 'Good' && 
                                                'You\'re doing well, but there\'s room for improvement.'}
                                            {performanceStatus === 'Needs Improvement' && 
                                                'Try to complete more tasks to improve your performance.'}
                                        </div>
                                    </div>

                                    <div className="stat-item">
                                        <h4>Tasks Overview</h4>
                                        <div className="tasks-breakdown">
                                            <div className="task-count">
                                                <span className="count">{totalTasks}</span>
                                                <span className="label">Total Tasks</span>
                                            </div>
                                            <div className="task-count completed">
                                                <span className="count">{completedTasks.length}</span>
                                                <span className="label">Completed</span>
                                            </div>
                                            <div className="task-count incomplete">
                                                <span className="count">{incompletedTasks.length}</span>
                                                <span className="label">Incomplete</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Image Section */}
                        <div className="image-section">
                            <div className="section-header">
                                <h3>My Images</h3>
                                <button 
                                    className="add-image-btn"
                                    onClick={() => {
                                        setShowUploadForm(!showUploadForm);
                                        setUploadError('');
                                        setSelectedFile(null);
                                        setImageDescription('');
                                        setSelectedCategory('');
                                    }}
                                >
                                    {showUploadForm ? 'Cancel' : 'Add New Image'}
                                </button>
                            </div>

                            {uploadError && (
                                <div className="error-message">
                                    {uploadError}
                                </div>
                            )}

                            {showUploadForm && (
                                <div className="upload-form">
                                    <div className="form-group">
                                        <label htmlFor="imageDescription">Description</label>
                                        <input
                                            id="imageDescription"
                                            type="text"
                                            value={imageDescription}
                                            onChange={(e) => setImageDescription(e.target.value)}
                                            placeholder="Enter image description"
                                            disabled={isUploading}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="imageCategory">Category</label>
                                        <select
                                            id="imageCategory"
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            disabled={isUploading}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="imageFile">Select Image</label>

                                        <input
                                            id="imageFile"
                                            type="file"
                                            accept="image/jpeg,image/png,image/gif,image/webp"
                                            onChange={handleFileChange}
                                            disabled={isUploading}
                                        />
                                        {selectedFile && (
                                            <div className="file-info">
                                                <p>Selected: {selectedFile.name}</p>
                                                <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)}MB</p>
                                            </div>
                                        )}
                                    </div>

                                    <button 
                                        className="upload-btn"
                                        onClick={handleUpload}
                                        disabled={!selectedFile || !imageDescription.trim() || !selectedCategory || isUploading}
                                    >
                                        {isUploading ? 'Uploading...' : 'Upload Image'}
                                    </button>
                                </div>
                            )}

                            {/* Image Gallery */}
                            <div className="image-gallery">
                                {userImages.map(image => (
                                    <div key={image.id} className="image-card">
                                        <img src={image.url} alt={image.description} />
                                        {editingImage === image.id ? (
                                            <div className="edit-form">
                                                <input
                                                    type="text"
                                                    value={imageDescription}
                                                    onChange={(e) => setImageDescription(e.target.value)}
                                                    placeholder="New description"
                                                />
                                                <div className="edit-buttons">
                                                    <button 
                                                        className="save-btn"
                                                        onClick={() => handleUpdate(image.id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button 
                                                        className="cancel-btn"
                                                        onClick={() => {
                                                            setEditingImage(null);
                                                            setImageDescription('');
                                                            setUploadError('');
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="image-actions">
                                                <h4>{image.description}</h4>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="edit-btn"
                                                        onClick={() => {
                                                            setEditingImage(image.id);
                                                            setImageDescription(image.description);
                                                            setUploadError('');
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="delete-btn"
                                                        onClick={() => handleDelete(image.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                
                            </div>
                        </div>
                      
                    </div>
                ) : (
                    <div className="loading">Loading profile...</div>
                )}
                 
            </div>

            <style>{`
                .profile-container {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .profile-card {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    padding: 20px;
                }

                .profile-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #eee;
                }

                .friends-link {
                    padding: 8px 16px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                    transition: background-color 0.3s;
                }

                .friends-link:hover {
                    background-color: #45a049;
                }

                .performance-section {
                    margin: 20px 0;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                .performance-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-top: 15px;
                }

                .stat-item {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .stat-item h4 {
                    color: #333;
                    margin-bottom: 15px;
                    font-size: 1.1em;
                }

                .progress-bar {
                    width: 100%;
                    height: 20px;
                    background: #e9ecef;
                    border-radius: 10px;
                    overflow: hidden;
                    margin: 10px 0;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #4CAF50, #45a049);
                    transition: width 0.3s ease;
                }

                .status {
                    font-weight: bold;
                    padding: 8px 12px;
                    border-radius: 4px;
                    display: inline-block;
                    margin-bottom: 10px;
                }

                .status.excellent {
                    background: #d4edda;
                    color: #155724;
                }

                .status.good {
                    background: #fff3cd;
                    color: #856404;
                }

                .status.needs\ improvement {
                    background: #f8d7da;
                    color: #721c24;
                }

                .status-description {
                    font-size: 0.9em;
                    color: #666;
                    margin-top: 10px;
                }

                .tasks-breakdown {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    text-align: center;
                }

                .task-count {
                    padding: 10px;
                    border-radius: 6px;
                    background: #f8f9fa;
                }

                .task-count .count {
                    display: block;
                    font-size: 1.5em;
                    font-weight: bold;
                    color: #333;
                }

                .task-count .label {
                    font-size: 0.9em;
                    color: #666;
                }

                .task-count.completed {
                    background: #d4edda;
                }

                .task-count.incomplete {
                    background: #f8d7da;
                }

                .loading {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                }

                /* ... rest of your existing styles ... */
            `}</style>
        </div>
    );
};

export default Profile;
