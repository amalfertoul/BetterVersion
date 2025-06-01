import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchUsers, updateUser, fetchCurrentUser, updateUserSuccess } from '../slices/UserSlice';
import { fetchImages, createImage, updateImage, deleteImage } from '../slices/imagesSlice';
import { fetchCategories } from '../slices/categorySlice';
import { fetchUserPerformance } from '../slices/userPerformanceSlice';
import { Link } from 'react-router-dom';
import '../style/profile.css';
import { fetchVisionBoards, createVisionBoard, updateVisionBoard, deleteVisionBoard } from '../slices/visionBoardSlice';
import { useNotification } from '../context/NotificationContext';

const Profile = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.users.user);
    const { images } = useSelector((state) => state.images);
    const { categories } = useSelector((state) => state.categories);
    const {
        completedTasks,
        incompletedTasks,
        totalTasks,
        completedPercentage,
        performanceStatus,
        status: performanceStatusLoading,
    } = useSelector((state) => state.userPerformance);
    const { visionBoards, loading: visionBoardLoading, error: visionBoardError } = useSelector((state) => state.visionBoard);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingImage, setEditingImage] = useState(null);
    const [imageDescription, setImageDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const { showSuccess, showError } = useNotification();

    const [showVBForm, setShowVBForm] = useState(false);
    const [vbName, setVBName] = useState('');
    const [vbVisibility, setVBVisibility] = useState(true);
    const [vbCategory, setVBCategory] = useState('');
    const [editingVB, setEditingVB] = useState(null);
    const [vbError, setVBError] = useState('');

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        profile_picture: ''
    });

    const isUpdatingProfilePicture = useRef(false);

    useEffect(() => {
        if (!currentUser) {
            dispatch(fetchUsers());
        }
        dispatch(fetchImages());
        dispatch(fetchCategories());
        if (currentUser?.id && !isUpdatingProfilePicture.current) {
            dispatch(fetchUserPerformance(currentUser.id));
        }
        dispatch(fetchVisionBoards());
        if (currentUser) {
            setFormData({
                fullname: currentUser.fullname || '',
                email: currentUser.email || '',
                profile_picture: currentUser.profile_picture || ''
            });
        }
    }, [dispatch, currentUser]);

    // Filter images for the current user
    const userImages = images.filter((img) => img.user_id === currentUser?.id);
    const userVisionBoards = visionBoards.filter(vb => vb.user_id === currentUser?.id);

    // Helper to get up to 3 images for a vision board
    const getVisionBoardImages = (visionBoardId) => {
        return images
            .filter(img => img.vision_board_id === visionBoardId)
            .slice(0, 3);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setUploadError('File size must be less than 5MB');
                setSelectedFile(null);
                return;
            }
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
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('description', imageDescription.trim());
            formData.append('user_id', currentUser.id);
            formData.append('category_id', selectedCategory);

            await dispatch(createImage(formData)).unwrap();

            setSelectedFile(null);
            setImageDescription('');
            setSelectedCategory('');
            setShowUploadForm(false);
            setUploadError('');
            dispatch(fetchImages());
        } catch (error) {
            setUploadError('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const startEditing = (image) => {
        setEditingImage(image.id);
        setImageDescription(image.description);
        setSelectedCategory(image.category_id); 
        setShowUploadForm(true); 
    };

    const handleUpdate = async (imageId) => {
        if (!imageDescription.trim() || !selectedCategory) {
            setUploadError('Please provide a description and select a category');
            return;
        }
        try {
            const formData = new FormData();
            if (imageDescription.trim()) {
                formData.append('description', imageDescription.trim());
            }
            if (selectedCategory) {
                formData.append('category_id', selectedCategory);
            }
            if (currentUser?.id) {
                formData.append('user_id', currentUser.id);
            }
            if (selectedFile) {
                formData.append('image', selectedFile);
            }
            await dispatch(
                updateImage({
                    id: imageId,
                    imageData: formData,
                })
            ).unwrap();
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
                setUploadError('Failed to delete image. Please try again.');
            }
        }
    };

    const handlePfpChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            showError('Image must be under 5MB');
            return;
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showError('Only JPG, PNG, or WEBP images allowed');
            return;
        }
        const formData = new FormData();
        formData.append('profile_picture', file);
        formData.append('user_id', currentUser.id);
        try {
            isUpdatingProfilePicture.current = true;
            console.log('Sending profile picture update request...');
            const response = await axios.post(
                `http://127.0.0.1:8000/api/users/${currentUser.id}/update-profile-picture`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log('Profile picture update response:', response.data);
            if (response.status === 200) {
                showSuccess('Profile picture updated successfully!');
                
                // Create the full URL for the new profile picture
                const newProfilePictureUrl = `/storage/${response.data.path}`;
                
                // Update the user object with the new profile picture URL
                const updatedUser = {
                    ...currentUser,
                    profile_picture_url: newProfilePictureUrl
                };
                
                // Update Redux store immediately
                dispatch(updateUserSuccess(updatedUser));
                
                // Preload the image
                const img = new Image();
                img.src = `http://127.0.0.1:8000${newProfilePictureUrl}`;
                
                // Only fetch users list after a short delay
                setTimeout(() => {
                    dispatch(fetchUsers());
                    isUpdatingProfilePicture.current = false;
                }, 1000);
                
                console.log('Updated user object:', updatedUser);
            } else {
                throw new Error('Failed to upload');
            }
        } catch (err) {
            console.error('Profile picture update error:', err);
            showError('Error updating profile picture.');
            isUpdatingProfilePicture.current = false;
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
                user_id: currentUser.id,
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showError('Image size should be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                showError('Please select an image file');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    profile_picture: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await dispatch(updateUser({
                id: currentUser.id,
                ...formData
            })).unwrap();
            showSuccess('Profile updated successfully!');
            // Refresh user data
            dispatch(fetchUsers());
        } catch (error) {
            showError(error.message || 'Failed to update profile');
        }
    };

    if (!currentUser) {
        return <div className="loading">Loading profile...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h2>My Profile</h2>
                </div>

                <div className="profile-content">
                    <div className="profile-avatar">
                        <div className="avatar-container">
                        {currentUser.profile_picture_url ? (
                            <img
                                src={`http://127.0.0.1:8000${currentUser.profile_picture_url}?t=${new Date().getTime()}`}
                                alt="Profile"
                                key={`profile-${currentUser.profile_picture_url}-${new Date().getTime()}`}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                        e.target.parentElement.querySelector('.default-avatar').style.display = 'block';
                                }}
                            />
                            ) : (
                                <div className="default-avatar">
                                    <img
                                        src="http://127.0.0.1:8000/storage/pfp/defaultpfp.jpg"
                                        alt="Default Profile"
                                    />
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            id="pfp-upload"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handlePfpChange}
                        />
                        <button className="change-pfp-btn" onClick={() => document.getElementById('pfp-upload').click()}>
                            Change Profile Picture
                        </button>
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

                    {/* Vision Board Section */}
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
                                userVisionBoards.map(vb => {
                                    const vbImages = getVisionBoardImages(vb.id);
                                    const placeholders = 3 - vbImages.length;
                                    return (
                                        <div key={vb.id} className="visionboard-card">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h4>{vb.name}</h4>
                                                <Link
                                                    to={`/vision-board/${vb.id}`}
                                                    style={{
                                                        marginLeft: 10,
                                                        background: '#2196F3',
                                                        color: '#fff',
                                                        padding: '4px 12px',
                                                        borderRadius: 4,
                                                        textDecoration: 'none',
                                                        fontSize: 13
                                                    }}
                                                >
                                                    View
                                                </Link>
                                            </div>
                                            <p>Visibility: {vb.visibility ? 'Public' : 'Private'}</p>
                                            <div className="vb-images-preview">
                                                {vbImages.map(img => (
                                                    <img
                                                        key={img.id}
                                                        src={`http://127.0.0.1:8000/storage/${img.url}`}
                                                        alt={img.description}
                                                        className="vb-preview-img"
                                                    />
                                                ))}
                                                {[...Array(placeholders)].map((_, idx) => (
                                                    <div
                                                        key={`placeholder-${idx}`}
                                                        className="vb-preview-placeholder"
                                                    />
                                                ))}
                                            </div>
                                            <div>
                                                <button onClick={() => handleEditVB(vb)}>Edit</button>
                                                <button onClick={() => handleDeleteVB(vb.id)} style={{color:'red'}}>Delete</button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="images-section">
                        <div className="section-header">
                            <h3>My Images</h3>
                            <button 
                                onClick={() => setShowUploadForm(!showUploadForm)}
                                className="upload-btn"
                            >
                                {showUploadForm ? 'Cancel' : 'Upload Image'}
                            </button>
                        </div>
                        {uploadError && <div className="error-message">{uploadError}</div>}

                        {showUploadForm && (
                            <div className="upload-form">
                                <input type="file" onChange={handleFileChange} />
                                <textarea
                                    value={imageDescription}
                                    onChange={e => setImageDescription(e.target.value)}
                                    placeholder="Image description"
                                />
                                <select
                                    value={selectedCategory}
                                    onChange={e => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={editingImage ? () => handleUpdate(editingImage) : handleUpload}
                                    disabled={isUploading}
                                >
                                    {isUploading ? 'Uploading...' : editingImage ? 'Update Image' : 'Upload Image'}
                                </button>
                            </div>
                        )}

                        <div className="user-images-list">
                            {userImages.length === 0 ? (
                                <div>No images posted yet.</div>
                            ) : (
                                userImages.map(img => (
                                    <div key={img.id} className="user-image-card">
                                        <img src={`http://127.0.0.1:8000/storage/${img.url}`} alt={img.description} style={{ width: 120, borderRadius: 8 }} />
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
                .profile-content {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .profile-avatar {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
                .avatar-container {
                    width: 150px;
                    height: 150px;
                    position: relative;
                    border-radius: 50%;
                    overflow: hidden;
                }
                .profile-avatar img, .default-avatar {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                }
                .default-avatar {
                    display: block;
                }
                .change-pfp-btn {
                    padding: 8px 16px;
                    background-color: #2196F3;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .change-pfp-btn:hover {
                    background-color: #0b7dda;
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
                .visionboard-section, .images-section {
                    margin: 20px 0;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }
                .add-vb-btn, .upload-btn {
                    padding: 8px 16px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .add-vb-btn:hover, .upload-btn:hover {
                    background-color: #45a049;
                }
                .visionboard-list, .user-images-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-top: 15px;
                }
                .visionboard-card, .user-image-card {
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .vb-images-preview {
                    display: flex;
                    gap: 6px;
                    margin: 10px 0 15px 0;
                }
                .vb-preview-img {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 6px;
                    background: #f2f2f2;
                    border: 1px solid #eee;
                }
                .vb-preview-placeholder {
                    width: 60px;
                    height: 60px;
                    border-radius: 6px;
                    background: #f7f7f7;
                    border: 1px solid #eee;
                    opacity: 0.7;
                }
                .vb-form, .upload-form, .edit-image-form {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .vb-form label, .upload-form label, .edit-image-form label {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .vb-form input, .vb-form select,
                .upload-form input, .upload-form textarea, .upload-form select,
                .edit-image-form input, .edit-image-form textarea, .edit-image-form select {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 1em;
                }
                .vb-form button, .upload-form button, .edit-image-form button {
                    padding: 10px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1em;
                    transition: background-color 0.3s;
                }
                .vb-form button:hover, .upload-form button:hover, .edit-image-form button:hover {
                    background-color: #0056b3;
                }
                .error-message {
                    color: red;
                    font-size: 0.9em;
                    margin-top: 10px;
                }
                .user-image-card img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                }
            `}</style>
        </div>
    );
};

export default Profile;