import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchVisionBoards, 
} from '../slices/visionBoardSlice';
import { fetchImages } from '../slices/imagesSlice';
import { fetchCategories } from '../slices/categorySlice';

const VisionBoard = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.users.userId);
    const { visionBoards, loading, error } = useSelector((state) => state.visionBoard);
    const images = useSelector((state) => state.images.images);
    const categories = useSelector((state) => state.categories.categories);
    
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [editingBoard, setEditingBoard] = useState(null);
    const [searchCategory, setSearchCategory] = useState('');

    useEffect(() => {
        dispatch(fetchVisionBoards());
        dispatch(fetchImages());
        dispatch(fetchCategories());
    }, [dispatch]);

    // Filter images based on category name
    const filteredImages = images.filter(image => {
        const imageCategory = categories.find(cat => cat.id === image.category_id);
        return !searchCategory || 
               (imageCategory && imageCategory.name.toLowerCase().includes(searchCategory.toLowerCase()));
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const boardData = {
            name,
            visibility: visibility === 'public',
            user_id: userId
        };

        try {
            if (editingBoard) {
                await dispatch(updateVisionBoard({ 
                    id: editingBoard.id, 
                    visionBoardData: boardData 
                })).unwrap();
            } else {
                await dispatch(createVisionBoard(boardData)).unwrap();
            }
            resetForm();
        } catch (err) {
            console.error('Error saving vision board:', err);
        }
    };

    const handleEdit = (board) => {
        setEditingBoard(board);
        setName(board.name);
        setVisibility(board.visibility ? 'public' : 'private');
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vision board?')) {
            try {
                await dispatch(deleteVisionBoard(id)).unwrap();
            } catch (err) {
                console.error('Error deleting vision board:', err);
            }
        }
    };

    const resetForm = () => {
        setName('');
        setVisibility('public');
        setShowForm(false);
        setEditingBoard(null);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container">
            <div className="header">
                <h2>Vision Boards</h2>
               
            </div>

            <div className="search-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by category name..."
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                    />
                </div>
            </div>

            <div className="image-grid">
                {filteredImages.map(image => (
                    <div key={image.id} className="image-card">
                        <img src={image.image_url} alt={image.title || 'vision'} />
                        <div className="image-info">
                            <span className="category-tag">
                                {categories.find(cat => cat.id === image.category_id)?.name || 'Uncategorized'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

        
        </div>
    );
};

export default VisionBoard; 