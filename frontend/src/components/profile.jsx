import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../slices/UserSlice';
import { fetchImages, createImage, updateImage, deleteImage } from '../slices/imagesSlice';
import { fetchCategories } from '../slices/categorySlice';
import { fetchTasks } from '../slices/userPerformanceSlice';
import { Link } from 'react-router-dom';
import { fetchVisionBoards, createVisionBoard, updateVisionBoard, deleteVisionBoard } from '../slices/visionBoardSlice';

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
    const { visionBoards, loading: visionBoardLoading, error: visionBoardError } = useSelector((state) => state.visionBoard);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingImage, setEditingImage] = useState(null);
    const [imageDescription, setImageDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [showVBForm, setShowVBForm] = useState(false);
    const [vbName, setVBName] = useState('');
    const [vbVisibility, setVBVisibility] = useState(true);
    const [vbCategory, setVBCategory] = useState('');
    const [editingVB, setEditingVB] = useState(null);
    const [vbError, setVBError] = useState('');
    
    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchImages());
        dispatch(fetchCategories());
        dispatch(fetchTasks());
        dispatch(fetchVisionBoards());
    }, [dispatch]);

    // Find the current user's data
    const currentUser = users.find(user => user.id === currentUserId);
    
    // Filter images for current user
    const userImages = images.filter(img => img.user_id === currentUserId);
    const userVisionBoards = visionBoards.filter(vb => vb.user_id === currentUserId);

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
                fileType: selectedFile.type,
                fileSize: selectedFile.size,
                categoryId: selectedCategory
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
        if (!imageDescription.trim() || !selectedCategory) {
            setUploadError('Please provide a description and select a category');
            return;
        }

        try {
            let imageData;
            if (selectedFile) {
                imageData = new FormData();
                imageData.append('image', selectedFile);
                imageData.append('description', imageDescription.trim());
                imageData.append('category_id', selectedCategory);
                imageData.append('user_id', currentUserId); // Ajoute user_id si besoin
            } else {
                imageData = {
                    description: imageDescription.trim(),
                    category_id: selectedCategory,
                    user_id: currentUserId
                };
            }

            await dispatch(updateImage({
                id: imageId,
                imageData
            })).unwrap();
            setEditingImage(null);
            setImageDescription('');
            setSelectedCategory('');
            setSelectedFile(null);
            setUploadError('');
            dispatch(fetchImages());
        } catch (error) {
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

    const handleAddVisionBoard = async (e) => {
        e.preventDefault();
        if (!vbName.trim() || !vbCategory) {
            setVBError('Name and category are required');
            return;
        }
        try {
            await dispatch(createVisionBoard({
                name: vbName,
                visibility: vbVisibility,
                user_id: currentUserId,
                category_id: vbCategory
            })).unwrap();
            setVBName('');
            setVBVisibility(true);
            setVBCategory('');
            setShowVBForm(false);
            setVBError('');
            dispatch(fetchVisionBoards());
        } catch (err) {
            setVBError('Failed to create vision board');
        }
    };

    const handleDeleteVB = async (id) => {
        if (window.confirm('Delete this vision board?')) {
            try {
                await dispatch(deleteVisionBoard(id)).unwrap();
                setVBError('');
            } catch {
                setVBError('Failed to delete vision board');
            }
        }
    };

    const handleEditVB = (vb) => {
        setEditingVB(vb.id);
        setVBName(vb.name);
        setVBVisibility(vb.visibility);
        setVBCategory(vb.category_id || '');
        setVBError('');
    };

    const handleUpdateVB = async (e) => {
        e.preventDefault();
        if (!vbName.trim() || !vbCategory) {
            setVBError('Name and category are required');
            return;
        }
        try {
            await dispatch(updateVisionBoard({
                id: editingVB,
                visionBoardData: {
                    name: vbName,
                    visibility: vbVisibility,
                    category_id: vbCategory
                }
            })).unwrap();
            setEditingVB(null);
            setVBName('');
            setVBVisibility(true);
            setVBCategory('');
            setVBError('');
            dispatch(fetchVisionBoards());
        } catch {
            setVBError('Failed to update vision board');
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h2>My Profile</h2>
                    <Link to="/friends" className="friends-link">
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
                                        <p className={`status ${performanceStatus.toLowerCase().replace(/\s/g, '-')}`}>
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
                        <div className="visionboard-section">
                            <div className="section-header">
                                <h3>My Vision Boards</h3>
                                <button 
                                    className="add-vb-btn"
                                    onClick={() => {
                                        setShowVBForm(!showVBForm);
                                        setVBError('');
                                        setVBName('');
                                        setVBVisibility(true);
                                        setVBCategory('');
                                        setEditingVB(null);
                                    }}
                                >
                                    {showVBForm ? 'Cancel' : 'Add Vision Board'}
                                </button>
                            </div>
                            {vbError && <div className="error-message">{vbError}</div>}
                            {(showVBForm || editingVB) && (
                                <form className="vb-form" onSubmit={editingVB ? handleUpdateVB : handleAddVisionBoard}>
                                    <div>
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            value={vbName}
                                            onChange={e => setVBName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Visibility</label>
                                        <select value={vbVisibility} onChange={e => setVBVisibility(e.target.value === 'true')}>
                                            <option value="true">Public</option>
                                            <option value="false">Private</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Category</label>
                                        <select value={vbCategory} onChange={e => setVBCategory(e.target.value)} required>
                                            <option value="">Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit">{editingVB ? 'Update' : 'Create'}</button>
                                </form>
                            )}
                            <div className="visionboard-list">
                                {visionBoardLoading ? (
                                    <div>Loading...</div>
                                ) : userVisionBoards.length === 0 ? (
                                    <div>No vision boards yet.</div>
                                ) : (
                                    userVisionBoards.map(vb => (
                                        <div key={vb.id} className="visionboard-card">
                                            <h4>{vb.name}</h4>
                                            <p>Visibility: {vb.visibility ? 'Public' : 'Private'}</p>
                                            <div>
                                                <button onClick={() => handleEditVB(vb)}>Edit</button>
                                                <button onClick={() => handleDeleteVB(vb.id)} style={{color:'red'}}>Delete</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Images Section */}
                        <div className="images-section">
                            <div className="section-header">
                                <h3>My Images</h3>
                            </div>
                            {uploadError && <div className="error-message">{uploadError}</div>}

                            <div className="user-images-list">
                                {userImages.length === 0 ? (
                                    <div>No images posted yet.</div>
                                ) : (
                                    userImages.map(img => (
                                        <div key={img.id} className="user-image-card">
                                            <img src={img.url} alt={img.description} style={{ width: 120, borderRadius: 8 }} />
                                            {editingImage === img.id ? (
                                                <form
                                                  className="edit-image-form"
                                                  onSubmit={e => {
                                                    e.preventDefault();
                                                    handleUpdate(img.id);
                                                  }}
                                                  encType="multipart/form-data"
                                                >
                                                  <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                  />
                                                  <textarea
                                                    value={imageDescription}
                                                    onChange={e => setImageDescription(e.target.value)}
                                                    required
                                                  />
                                                  <select
                                                    value={selectedCategory}
                                                    onChange={e => setSelectedCategory(e.target.value)}
                                                    required
                                                  >
                                                    <option value="">Select a category</option>
                                                    {categories.map(cat => (
                                                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                  </select>
                                                  <button type="submit">Save</button>
                                                  <button type="button" onClick={() => setEditingImage(null)}>Cancel</button>
                                                </form>
                                            ) : (
                                                <>
                                                  <div style={{ fontSize: 13, margin: '8px 0' }}>{img.description}</div>
                                                  <button onClick={() => {
                                                    setEditingImage(img.id);
                                                    setImageDescription(img.description);
                                                    setSelectedCategory(img.category_id);
                                                    setSelectedFile(null);
                                                  }}>
                                                    Edit
                                                  </button>
                                                  <button onClick={() => handleDelete(img.id)} style={{ color: 'red', marginLeft: 8 }}>
                                                    Delete
                                                  </button>
                                                </>
                                            )}
                                        </div>
                                    ))
                                )}
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

                .status.needs-improvement {
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

                .visionboard-section {
                    margin: 20px 0;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                .visionboard-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-top: 15px;
                }

                .visionboard-card {
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .vb-form {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 15px;
                    margin-bottom: 20px;
                }

                .vb-form label {
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                .vb-form input,
                .vb-form select {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 1em;
                }

                .vb-form button {
                    padding: 10px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1em;
                    transition: background-color 0.3s;
                }

                .vb-form button:hover {
                    background-color: #0056b3;
                }

                .error-message {
                    color: red;
                    font-size: 0.9em;
                    margin-top: 10px;
                }

                .images-section {
                    margin: 20px 0;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                .user-images-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                }

                .user-image-card {
                    background: white;
                    padding: 10px;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    text-align: center;
                }

                .user-image-card img {
                    width: 100%;
                    border-radius: 8px;
                    object-fit: cover;
                }

                .edit-image-form {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 10px;
                    margin-top: 10px;
                }

                .edit-image-form textarea {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 1em;
                    resize: none;
                }

                .edit-image-form select {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 1em;
                }

                .edit-image-form button {
                    padding: 10px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1em;
                    transition: background-color 0.3s;
                }

                .edit-image-form button:hover {
                    background-color: #0056b3;
                }

                /* ... rest of your existing styles ... */
            `}</style>
        </div>
    );
};

export default Profile;