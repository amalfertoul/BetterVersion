import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createVisionBoard, fetchVisionBoards, deleteVisionBoard, updateVisionBoard } from '../slices/visionBoardSlice';

const visionboard = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.users.userId);
    const { visionBoards, loading, error } = useSelector((state) => state.visionBoard);

    const [showForm, setShowForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [boardToDelete, setBoardToDelete] = useState(null);
    const [boardToEdit, setBoardToEdit] = useState(null);
    const [boardName, setBoardName] = useState('');
    const [visibility, setVisibility] = useState(true); // true = public, false = private
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (userId) {
            dispatch(fetchVisionBoards());
        }
    }, [dispatch, userId]);

    const handleCreateVisionBoard = async (e) => {
        e.preventDefault();
        if (!boardName) return;

        const visionBoardData = {
            name: boardName,
            user_id: userId,
            visibility: visibility
        };

        try {
            await dispatch(createVisionBoard(visionBoardData)).unwrap();
            setShowForm(false);
            setBoardName('');
            setVisibility(true);
            dispatch(fetchVisionBoards());
        } catch (err) {
            console.error('Error creating vision board:', err);
        }
    };

    const handleEditClick = (board) => {
        setBoardToEdit(board);
        setBoardName(board.name);
        setVisibility(board.visibility);
        setShowEditForm(true);
    };

    const handleUpdateVisionBoard = async (e) => {
        e.preventDefault();
        if (!boardToEdit || !boardName) return;

        const visionBoardData = {
            name: boardName,
            user_id: userId,
            visibility: visibility
        };

        try {
            await dispatch(updateVisionBoard({ id: boardToEdit.id, visionBoardData })).unwrap();
            setShowEditForm(false);
            setBoardToEdit(null);
            setBoardName('');
            setVisibility(true);
            dispatch(fetchVisionBoards());
        } catch (err) {
            console.error('Error updating vision board:', err);
        }
    };

    const handleDeleteClick = (board) => {
        setBoardToDelete(board);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!boardToDelete) return;

        try {
            await dispatch(deleteVisionBoard(boardToDelete.id)).unwrap();
            setShowDeleteConfirm(false);
            setBoardToDelete(null);
            dispatch(fetchVisionBoards());
        } catch (err) {
            console.error('Error deleting vision board:', err);
        }
    };

    // Filtrer les vision boards de l'utilisateur connecté et par terme de recherche
    const userVisionBoards = visionBoards
        .filter(board => board.user_id === userId)
        .filter(board => 
            board.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
        <div >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Mes Vision Boards</h1>
                <button
                    onClick={() => setShowForm(true)}
                  
                >
                    + Nouveau Vision Board
                </button>
            </div>

            {/* Barre de recherche */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Rechercher un vision board..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    
                />
            </div>

            {showForm && (
                <div>
                    <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Créer un Vision Board</h2>
                    <form onSubmit={handleCreateVisionBoard}>
                        <div >
                            <label >
                                Nom du Vision Board:
                            </label>
                            <input
                                type="text"
                                value={boardName}
                                onChange={(e) => setBoardName(e.target.value)}
                               
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label >
                                Visibilité:
                            </label>
                            <select
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value === 'true')}
                              
                            >
                                <option value="true">Public</option>
                                <option value="false">Privé</option>
                            </select>
                        </div>
                        <div >
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setBoardName('');
                                    setVisibility(true);
                                }}
                              
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                
                            >
                                Créer
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showEditForm && boardToEdit && (
                <div >
                    <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Modifier le Vision Board</h2>
                    <form onSubmit={handleUpdateVisionBoard}>
                        <div >
                            <label >
                                Nom du Vision Board:
                            </label>
                            <input
                                type="text"
                                value={boardName}
                                onChange={(e) => setBoardName(e.target.value)}
                               
                                required
                            />
                        </div>
                        <div >
                            <label>
                                Visibilité:
                            </label>
                            <select
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value === 'true')}
                              
                            >
                                <option value="true">Public</option>
                                <option value="false">Privé</option>
                            </select>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowEditForm(false);
                                    setBoardToEdit(null);
                                    setBoardName('');
                                    setVisibility(true);
                                }}
                               
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                               
                            >
                                Mettre à jour
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showDeleteConfirm && boardToDelete && (
                <div>
                    <h2 >Confirmer la suppression</h2>
                    <p >
                        Êtes-vous sûr de vouloir supprimer le vision board "{boardToDelete.name}" ?
                        Cette action est irréversible.
                    </p>
                    <div>
                        <button
                            onClick={() => {
                                setShowDeleteConfirm(false);
                                setBoardToDelete(null);
                            }}
                          
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            )}

            {userVisionBoards.length > 0 ? (
                <div>
                    {userVisionBoards.map((board) => (
                        <div 
                            key={board.id}
                           
                        >
                            <div>
                                <button
                                    onClick={() => handleEditClick(board)}
                                   
                                >
                                    ✎
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(board)}
                                   
                                >
                                    ×
                                </button>
                            </div>
                            <h3 >{board.name}</h3>
                            <p >
                                <strong>Visibilité:</strong> {board.visibility ? 'Public' : 'Privé'}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div >
                    <p >Vous n'avez pas encore de vision boards.</p>
                    <p >Cliquez sur "Nouveau Vision Board" pour en créer un.</p>
                </div>
            )}
        </div>
    );
};

export default visionboard;