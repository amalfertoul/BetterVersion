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
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            e.preventDefault();
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleTouchStart = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({
            x: touch.clientX - position.x,
            y: touch.clientY - position.y
        });
    };

    const handleTouchMove = (e) => {
        if (isDragging) {
            e.preventDefault();
            const touch = e.touches[0];
            setPosition({
                x: touch.clientX - dragStart.x,
                y: touch.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, dragStart]);

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
                                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                maxWidth: '100%',
                                height: 'auto',
                                objectFit: 'contain',
                                transformOrigin: 'center center',
                                cursor: isDragging ? 'grabbing' : 'grab',
                                userSelect: 'none',
                                touchAction: 'none'
                            }}
                            onMouseDown={handleMouseDown}
                            onTouchStart={handleTouchStart}
                            draggable="false"
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