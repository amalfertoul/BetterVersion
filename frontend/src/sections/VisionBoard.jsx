import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVisionBoards } from '../slices/visionBoardSlice';
import { fetchImages, updateImage } from '../slices/imagesSlice';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/VisionBoard.css'; // Assuming you have a CSS file for styles
const VisionBoardDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { visionBoards, loading, error } = useSelector((state) => state.visionBoard);
    const { images } = useSelector((state) => state.images);

    const [deleteError, setDeleteError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [animationClass, setAnimationClass] = useState('animate-in');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await dispatch(fetchVisionBoards());
                await dispatch(fetchImages());
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                    setAnimationClass('animate-in');
                }, 500);
            }
        };
        
        fetchData();
    }, [dispatch]);

    const visionBoard = visionBoards.find(board => board.id === parseInt(id));
    const boardImages = images.filter(img => img.vision_board_id === parseInt(id));

    const handleRemoveImage = async (imageId) => {
        setAnimationClass('animate-out');
        try {
            const formData = new FormData();
            formData.append('vision_board_id', '');
            await dispatch(updateImage({
                id: imageId,
                imageData: formData
            })).unwrap();
            
            setDeleteError('');
            setTimeout(() => {
                dispatch(fetchImages());
                setAnimationClass('animate-in');
            }, 300);
        } catch (err) {
            setDeleteError('Failed to remove image from vision board.');
            setAnimationClass('animate-in');
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your vision board...</p>
            </div>
        );
    }

    if (error) return <div className="error-message">Error: {error}</div>;
    if (!visionBoard) return <div className="not-found">Vision board not found.</div>;

    return (
        <div className={`vision-board-container ${animationClass}`}>
            <div className="header-section">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back
                </button>
                
                <div className="board-header">
                    <div className="title-container">
                        <h1>{visionBoard.name}</h1>
                        <div className={`visibility-tag ${visionBoard.visibility ? 'public' : 'private'}`}>
                            {visionBoard.visibility ? (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 19 12 19C17 19 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Public
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M12 18.5C13.3807 18.5 14.5 17.3807 14.5 16C14.5 14.6193 13.3807 13.5 12 13.5C10.6193 13.5 9.5 14.6193 9.5 16C9.5 17.3807 10.6193 18.5 12 18.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Private
                                </>
                            )}
                        </div>
                    </div>
                    
                    <div className="board-stats">
                        <div className="stat-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M4 19.5V4.5C4 3.4 4.9 2.5 6 2.5H18C19.1 2.5 20 3.4 20 4.5V19.5C20 20.6 19.1 21.5 18 21.5H6C4.9 21.5 4 20.6 4 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M4 10.5H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 2.5V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {boardImages.length} image{boardImages.length !== 1 ? 's' : ''}
                        </div>
                        <div className="stat-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Created on {new Date(visionBoard.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="content-section">
                <h2 className="section-title">Images in this Vision Board</h2>
                
                {deleteError && <div className="error-banner">{deleteError}</div>}
                
                {boardImages.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                <path d="M4 19.5V4.5C4 3.4 4.9 2.5 6 2.5H18C19.1 2.5 20 3.4 20 4.5V19.5C20 20.6 19.1 21.5 18 21.5H6C4.9 21.5 4 20.6 4 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M4 10.5H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 2.5V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8.5 15.5H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8.5 18.5H12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3>No images in this vision board</h3>
                        <p>Start by adding images to visualize your goals</p>
                    </div>
                ) : (
                    <div className="image-grid">
                        {boardImages.map(img => (
                            <div key={img.id} className="image-card">
                                <div className="image-wrapper">
                                    <img
                                        src={`http://127.0.0.1:8000/storage/${img.url}`}
                                        alt={img.description}
                                        className="board-image"
                                    />
                                    <div className="image-overlay">
                                        <p className="image-description">{img.description || "No description"}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveImage(img.id)}
                                    className="remove-button"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="inspiration-quote">
                <div className="quote-icon">❝</div>
                <p>Your vision will only become reality when you visualize it clearly in your mind.</p>
            </div>
        </div>
    );
};

export default VisionBoardDetail;