import React from 'react';

const ImageGallery = ({
    userImages,
    categories,
    showUploadForm,
    setShowUploadForm,
    uploadError,
    setUploadError,
    selectedFile,
    setSelectedFile,
    imageDescription,
    setImageDescription,
    selectedCategory,
    setSelectedCategory,
    handleFileChange,
    handleUpload,
    handleUpdate,
    handleDelete,
    editingImage,
    setEditingImage,
    isUploading,
}) => (
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
                                    onClick={() => setEditingImage(image.id)}
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
);

export default ImageGallery;