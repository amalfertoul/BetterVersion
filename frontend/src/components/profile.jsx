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
            if (response.status === 200) {
                showSuccess('Profile picture updated successfully!');
                const newProfilePictureUrl = `/storage/${response.data.path}`;
                const updatedUser = {
                    ...currentUser,
                    profile_picture_url: newProfilePictureUrl
                };
                dispatch(updateUserSuccess(updatedUser));
                const img = new Image();
                img.src = `http://127.0.0.1:8000${newProfilePictureUrl}`;
                setTimeout(() => {
                    dispatch(fetchUsers());
                    isUpdatingProfilePicture.current = false;
                }, 1000);
            } else {
                throw new Error('Failed to upload');
            }
        } catch (err) {
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

    // Edit handler: open the form and pre-fill values
    const handleEditVB = (vb) => {
        setEditingVB(vb.id);
        setVBName(vb.name);
        setVBVisibility(vb.visibility);
        setVBCategory(vb.category_id || '');
        setVBError('');
        setShowVBForm(true); // Show the form when editing
    };

    // Cancel handler: reset and close the form
    const handleCancelVBEdit = () => {
        setEditingVB(null);
        setVBName('');
        setVBVisibility(true);
        setVBCategory('');
        setVBError('');
        setShowVBForm(false);
    };

    // Update handler
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
            setShowVBForm(false);
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
                    <div className="profile-avatar" style={{ marginBottom: 16 }}>
                        {/* Show avatar if no profile picture, else show profile picture */}
                        {currentUser.profile_picture_url ? (
                            <img
                                src={`http://127.0.0.1:8000${currentUser.profile_picture_url}?t=${new Date().getTime()}`}
                                alt="Profile"
                                key={`profile-${currentUser.profile_picture_url}-${new Date().getTime()}`}
                                style={{ display: 'block' }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.querySelector('.default-avatar').style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div
                            className="default-avatar"
                            style={{
                                display: currentUser.profile_picture_url ? 'none' : 'flex',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {currentUser.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <input
                            type="file"
                            id="pfp-upload"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handlePfpChange}
                        />
                        {/* Move button below the avatar/photo */}
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 12 }}>
                            <button
                                className="change-pfp-btn"
                                style={{
                                    position: 'static',
                                    borderRadius: 20,
                                    padding: '7px 18px',
                                    fontSize: '0.9rem',
                                    margin: 0
                                }}
                                onClick={() => document.getElementById('pfp-upload').click()}
                            >
                                Change Profile Picture
                            </button>
                        </div>
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
                                            style={{ '--progress': `${completedPercentage}%` }}
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

                                <div className="stat-item" style={{ paddingBottom: 24 /* Add bottom padding */ }}>
                                    <h4>Tasks Overview</h4>
                                    <div className="tasks-breakdown" style={{ marginTop: 12 }}>
                                        <div className="task-count">
                                            <span className="count">{totalTasks}</span>
                                            <span className="label">Total Tasks</span>
                                        </div>
                                        <div className="task-count completed">
                                            <span className="count">{completedTasks.length}</span>
                                            <span className="label"> Completed Tasks</span>
                                        </div>
                                        <div className="task-count incomplete">
                                            <span className="count">{incompletedTasks.length}</span>
                                            <span className="label"> Incomplete Tasks</span>
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
                                    <select
                                        value={vbVisibility ? "true" : "false"}
                                        onChange={e => setVBVisibility(e.target.value === "true")}
                                    >
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
                                {(editingVB || showVBForm) && (
                                    <button type="button" onClick={handleCancelVBEdit} style={{ marginLeft: 8 }}>Cancel</button>
                                )}
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
                                            {/* Make the images preview div a fixed height to match stat cards */}
                                            <div
                                                className="vb-images-preview"
                                                style={{
                                                    minHeight: 140,
                                                    alignItems: 'center',
                                                    justifyItems: 'center',
                                                    display: 'grid'
                                                }}
                                            >
                                                {vbImages.map(img => (
                                                    <img
                                                        key={img.id}
                                                        src={`http://127.0.0.1:8000/storage/${img.url}`}
                                                        alt={img.description}
                                                        className="vb-preview-img"
                                                        style={{ height: 120, width: 120, objectFit: 'cover' }}
                                                    />
                                                ))}
                                                {[...Array(placeholders)].map((_, idx) => (
                                                    <div
                                                        key={`placeholder-${idx}`}
                                                        className="vb-preview-placeholder"
                                                        style={{ height: 120, width: 120 }}
                                                    />
                                                ))}
                                            </div>
                                            <div>
                                                <button onClick={() => handleEditVB(vb)}>Edit</button>
                                                <button onClick={() => handleDeleteVB(vb.id)} style={{ color: 'red' }}>Delete</button>
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
        </div>
    );
};

export default Profile;