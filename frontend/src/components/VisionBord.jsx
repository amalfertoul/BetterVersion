import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchVisionBoards, 
} from '../slices/visionBoardSlice';
import { fetchImages } from '../slices/imagesSlice';
import { fetchCategories } from '../slices/categorySlice';
import { Link } from 'react-router-dom';

const VisionBoard = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.users.userId);
    const { visionBoards, loading, error } = useSelector((state) => state.visionBoard);
    const images = useSelector((state) => state.images.images);
    const categories = useSelector((state) => state.categories.categories);
    const isAuthenticated = useSelector((state) => state.users.isAuthenticated);
    
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
        <div className="vision-board-container">
            <div className="vision-board-header">
                <h1>Vision Board</h1>
                {isAuthenticated && (
                    <Link to="/todolist" className="todo-link">
                        Go to Todo List
                    </Link>
                )}
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

            <style>{`
                .vision-board-container {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .vision-board-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }

                .vision-board-header h1 {
                    color: #333;
                    margin: 0;
                }

                .todo-link {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                }

                .todo-link:hover {
                    background-color: #45a049;
                }

                @media (max-width: 768px) {
                    .vision-board-header {
                        flex-direction: column;
                        gap: 15px;
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default VisionBoard; 