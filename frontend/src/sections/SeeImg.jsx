import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchImageById } from '../slices/imagesSlice'; // adjust path if needed
import { useParams, useNavigate } from 'react-router-dom';
import '../style/theme.css';

const SeeImg = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { image, status, error } = useSelector((state) => state.images);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (id) {
            dispatch(fetchImageById(id));
        }
    }, [dispatch, id]);

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.25, 0.5));
    };

    const buttonStyle = {
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        padding: '0.5rem',
        borderRadius: '0.5rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-md)',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.25rem',
        width: '2.5rem',
        height: '2.5rem',
        marginRight: '1rem'
    };

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: 'var(--body-color)' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--primary-color)' }}></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--body-color)' }}>
                <div className="text-red-500 text-xl mb-4">{error}</div>
                <button 
                    onClick={() => navigate(-1)}
                    style={buttonStyle}
                >
                    <i className='bx bx-arrow-back'></i>
                </button>
            </div>
        );
    }

    if (!image) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--body-color)' }}>
                <div className="text-xl mb-4" style={{ color: 'var(--text-color)' }}>No image found.</div>
                <button 
                    onClick={() => navigate(-1)}
                    style={buttonStyle}
                >
                    <i className='bx bx-arrow-back'></i>
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative" style={{ backgroundColor: 'var(--body-color)' }}>
            <div className="p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center rounded-lg overflow-hidden">
                        <img
                            src={`http://127.0.0.1:8000/storage/${image.url || image.path || image.image_url}`}
                            alt={image.title || 'Image'}
                            className="rounded-lg"
                            style={{
                                transform: `scale(${scale})`,
                                maxWidth: '100%',
                                height: 'auto',
                                objectFit: 'contain',
                                transformOrigin: 'center center'
                            }}
                        />
                    </div>
                </div>
            </div>
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '0.5rem',
                backdropFilter: 'blur(8px)'
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={buttonStyle}
                >
                    <i className='bx bx-arrow-back'></i>
                </button>
                <button
                    onClick={handleZoomIn}
                    style={buttonStyle}
                    title="Zoom In"
                >
                    <i className='bx bx-zoom-in'></i>
                </button>
                <button
                    onClick={handleZoomOut}
                    style={buttonStyle}
                    title="Zoom Out"
                >
                    <i className='bx bx-zoom-out'></i>
                </button>
            </div>
        </div>
    );
};

export default SeeImg;