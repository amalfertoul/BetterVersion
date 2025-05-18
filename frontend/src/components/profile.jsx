import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../slices/UserSlice';
import { fetchImages, createImage, updateImage, deleteImage } from '../slices/imagesSlice';
import { fetchCategories } from '../slices/categorySlice';
import { fetchUserPerformance } from '../slices/userPerformanceSlice';
import { Link } from 'react-router-dom';
import '../style/profile.css';

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

    const [selectedFile, setSelectedFile] = useState(null);
    const [editingImage, setEditingImage] = useState(null);
    const [imageDescription, setImageDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    

    useEffect(() => {
        if (!currentUser) {
            dispatch(fetchUsers());
        }
        dispatch(fetchImages());
        dispatch(fetchCategories());
        dispatch(fetchUserPerformance());
    }, [dispatch, currentUser]);

    // Filter images for the current user
    const userImages = images.filter((img) => img.user_id === currentUser?.id);

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
        if (!imageDescription.trim()) {
            setUploadError('Please provide a description');
            return;
        }

        try {
            const formData = new FormData();

            // Append fields to FormData
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

            // Dispatch the updateImage thunk
            const updatedImage = await dispatch(
                updateImage({
                    id: imageId,
                    imageData: formData,
                })
            ).unwrap();

            // Update the local state to reflect the updated image
            dispatch(fetchImages()); // Re-fetch all images to update the gallery

            // Reset state after successful update
            setEditingImage(null);
            setImageDescription('');
            setSelectedFile(null);
            setUploadError('');
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

    if (!currentUser) {
        return <div className="loading">Loading profile...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h2>My Profile</h2>
                    <Link to="/friends" className="friends-link">
                        My Friends List
                    </Link>
                </div>

                <div className="profile-content">
                    <div className="profile-avatar">
                        {currentUser.profile_picture_url ? (
                            <img src={`http://127.0.0.1:8000${currentUser.profile_picture_url}`} alt="Profile" />
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

                        {uploadError && <div className="error-message">{uploadError}</div>}

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
                                        {categories.map((category) => (
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
                            {userImages.map((image) => (
                                <div key={image.id} className="image-card">
                                    <img src={`http://127.0.0.1:8000/storage/${image.url}`} alt={image.description} />
                                    {editingImage === image.id ? (
                                        <div className="edit-form">
                                            <input
                                                type="text"
                                                value={imageDescription}
                                                onChange={(e) => setImageDescription(e.target.value)}
                                                placeholder="New description"
                                            />

                                    <div className="form-group">
                                        <label htmlFor="imageCategory">Category</label>
                                        <select
                                            id="imageCategory"
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            disabled={isUploading}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>



                                            
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
                                                    onClick={() => startEditing(image)}
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
            </div>
        </div>
    );
};

export default Profile;
