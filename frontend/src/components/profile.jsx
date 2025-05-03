// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserById, updateUserProfile } from './slices/userSlice';

// const UserProfile = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { user, loading, error } = useSelector((state) => state.users);
//     const [visionBoards, setVisionBoards] = useState([]);
//     const [newProfilePicture, setNewProfilePicture] = useState(null);
//     const [uploadError, setUploadError] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 if (!user) {
//                     // Fetch the currently signed-in user's data
//                     const response = await axios.get('http://localhost:8000/api/auth/user');
//                     await dispatch(fetchUserById(response.data.id));
//                 }

//                 const boardsResponse = await axios.get('http://localhost:8000/api/visionboards');
//                 const filteredBoards = Array.isArray(boardsResponse.data)
//                     ? boardsResponse.data.filter((board) => board.user_id.toString() === user.id.toString())
//                     : [];
//                 setVisionBoards(filteredBoards);
//             } catch (err) {
//                 console.error('Erreur de chargement des données', err);
//             }
//         };

//         fetchData();
//     }, [dispatch, user]);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         setNewProfilePicture(file);
//     };

//     const handleImageUpload = async () => {
//         if (!newProfilePicture) return;

//         const formData = new FormData();
//         formData.append('profile_picture', newProfilePicture);

//         try {
//             const res = await axios.post(
//                 `http://localhost:8000/api/users/${user.id}/upload`,
//                 formData,
//                 {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 }
//             );

//             if (res.data && res.data.profile_picture) {
//                 dispatch(updateUserProfile({ ...user, profile_picture: res.data.profile_picture }));
//                 setNewProfilePicture(null);
//                 setUploadError(null);
//             } else {
//                 throw new Error('Invalid response from server');
//             }
//         } catch (err) {
//             console.error('Erreur lors du téléchargement de l\'image', err);
//             setUploadError('Erreur lors du téléchargement de la photo de profil. Veuillez réessayer.');
//         }
//     };

//     if (loading) return <div>Chargement en cours...</div>;
//     if (error) return <div>{error}</div>;
//     if (!user) return <div>Aucune donnée utilisateur disponible</div>;

//     return (
//         <div className="profile-page">
//             <h1>{user.fullname || 'Nom non disponible'}</h1>
//             <img
//                 src={user.profile_picture || 'https://via.placeholder.com/150'}
//                 alt="Photo de profil"
//                 style={{ width: '150px', borderRadius: '10px' }}
//             />
//             <p><strong>Nom d'utilisateur: </strong>{user.username}</p>
//             <p><strong>Email: </strong>{user.email}</p>

//             <div>
//                 <h3>Changer la photo de profil</h3>
//                 <input type="file" accept="image/*" onChange={handleImageChange} />
//                 <button onClick={handleImageUpload}>Télécharger</button>
//                 {uploadError && <p className="error">{uploadError}</p>}
//             </div>

//             <h2>Vision Boards</h2>
//             {visionBoards.length === 0 ? (
//                 <p>Aucun board pour ce compte.</p>
//             ) : (
//                 <ul>
//                     {visionBoards.map((board) => (
//                         <li key={board.board_id}>
//                             <strong>{board.name}</strong> - Visibilité : {board.visibility ? 'Publique' : 'Privée'}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default UserProfile;
import React from 'react';
import { useSelector } from 'react-redux';
import FriendRequest from '../sections/friendRequest';
const UserProfile = () => {
    const userId = useSelector((state) => state.users.userId);
    return (
        <div style={{ padding: '20px', fontSize: '18px' }}>
            <h2>User ID Page</h2>
            {userId ? (
                <p><strong>User ID:</strong> {userId}</p>
            ) : (
                <p>No user is currently logged in.</p>
            )}
            <FriendRequest /> 
        </div>
    );
};

export default UserProfile;
