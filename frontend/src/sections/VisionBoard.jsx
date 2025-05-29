import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVisionBoards } from '../slices/visionBoardSlice';
import { fetchImages, updateImage } from '../slices/imagesSlice';
import { useParams, useNavigate } from 'react-router-dom';

const VisionBoardDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams(); // vision board id from route
    const { visionBoards, loading, error } = useSelector((state) => state.visionBoard);
    const { images } = useSelector((state) => state.images);

    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        dispatch(fetchVisionBoards());
        dispatch(fetchImages());
    }, [dispatch]);

    // Find the vision board by id
    const visionBoard = visionBoards.find(board => board.id === parseInt(id));

    // Get all images belonging to this vision board
    const boardImages = images.filter(img => img.vision_board_id === parseInt(id));

   const handleRemoveImage = async (imageId) => {
        try {
            const formData = new FormData();
            formData.append('vision_board_id', '');
            await dispatch(updateImage({
                id: imageId,
                imageData: formData
            })).unwrap();
            setDeleteError('');
            dispatch(fetchImages());
        } catch (err) {
            setDeleteError('Failed to remove image from vision board.');
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;
    if (!visionBoard) return <div>Vision board introuvable.</div>;

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>← Retour</button>
            <h1>{visionBoard.name}</h1>
            <p><strong>Visibilité:</strong> {visionBoard.visibility ? 'Public' : 'Privé'}</p>
            <hr style={{ margin: '20px 0' }} />
            <h2>Images dans ce Vision Board</h2>
            {deleteError && <div style={{ color: 'red', marginBottom: 10 }}>{deleteError}</div>}
            {boardImages.length === 0 ? (
                <div>Aucune image dans ce vision board.</div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 20,
                    marginTop: 20
                }}>
                    {boardImages.map(img => (
                        <div key={img.id} style={{
                            background: '#fff',
                            borderRadius: 8,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                            padding: 12,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <img
                                src={`http://127.0.0.1:8000/storage/${img.url}`}
                                alt={img.description}
                                style={{ width: '100%', maxWidth: 150, borderRadius: 6, marginBottom: 10 }}
                            />
                            <div style={{ fontSize: 14, color: '#444', marginBottom: 8 }}>{img.description}</div>
                            <button
                                onClick={() => handleRemoveImage(img.id)}
                                style={{
                                    background: '#f44336',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 4,
                                    padding: '6px 14px',
                                    cursor: 'pointer'
                                }}
                            >
                                Retirer du vision board
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VisionBoardDetail;