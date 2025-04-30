import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [visionBoards, setVisionBoards] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newProfilePicture, setNewProfilePicture] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch user data
                const userResponse = await axios.get(`http://localhost:8000/api/users/${userId}`);
                setUser(userResponse.data);
                
                // Fetch vision boards
                const boardsResponse = await axios.get(`http://localhost:8000/api/visionboards`);
                const filteredBoards = boardsResponse.data.filter(board => 
                    board.user_id.toString() === userId.toString()
                );
                setVisionBoards(filteredBoards);
            } catch (err) {
                setError('Erreur de chargement des données');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewProfilePicture(file);
    };

    const handleImageUpload = async () => {
        if (!newProfilePicture) return;

        const formData = new FormData();
        formData.append('profile_picture', newProfilePicture);

        try {
            const res = await axios.post(
                `http://localhost:8000/api/users/${userId}/upload`, 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setUser({ ...user, profile_picture: res.data.profile_picture });
            setNewProfilePicture(null);
        } catch (err) {
            setError('Erreur lors du téléchargement de l\'image');
            console.error('Error:', err);
        }
    };

    if (loading) return <div>Chargement en cours...</div>;
    if (error) return <div>{error}</div>;
    if (!user) return <div>Aucune donnée utilisateur disponible</div>;

    return (
        <div className="profile-page">
            <h1>{user.fullname}</h1>
            <img
                src={user.profile_picture || 'https://via.placeholder.com/150'}
                alt="Photo de profil"
                style={{ width: '150px', borderRadius: '10px' }}
            />
            <p><strong></strong> {user.username}</p>
            <p><strong></strong> {user.email}</p>

            <div>
                <h3>Changer la photo de profil</h3>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <button onClick={handleImageUpload}>Télécharger</button>
            </div>

            <h2>Vision Boards</h2>
            {visionBoards.length === 0 ? (
                <p>Aucun board pour ce compte.</p>
            ) : (
                <ul>
                    {visionBoards.map(board => (
                        <li key={board.board_id}>
                            <strong>{board.name}</strong> - Visibilité : {board.visibility ? 'Publique' : 'Privée'}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserProfile;