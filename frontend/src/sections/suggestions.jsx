import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../slices/UserSlice';
import { createFriendRequest, sendFriendRequest } from '../slices/friendRequestSlice';
import { useNotification } from '../context/NotificationContext';

const Suggestions = () => {
    const dispatch = useDispatch();
    const { showSuccess, showError, showInfo } = useNotification();
    const users = useSelector((state) => state.users.users);
    const currentUserId = useSelector((state) => state.users.user?.id);
    const pendingRequests = useSelector((state) => state.friendRequests.pending);
    const acceptedRequests = useSelector((state) => state.friendRequests.accepted);
    const loading = useSelector((state) => state.users.loading);
    const error = useSelector((state) => state.users.error);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleSendRequest = async (userId) => {
        try {
            showInfo('Sending friend request...');
            await dispatch(sendFriendRequest({ sender_id: currentUserId, receiver_id: userId }));
            showSuccess('Friend request sent successfully!');
        } catch (error) {
            showError('Failed to send friend request. Please try again.');
        }
    };

    const filteredUsers = users
        .filter(user => user.id !== currentUserId)
        .slice(0, 30);

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            {filteredUsers
                // Exclude users with pending requests (in either direction)
                .filter(user =>
                    !pendingRequests.some(request =>
                        (request.sender_id === currentUserId && request.receiver_id === user.id) ||
                        (request.sender_id === user.id && request.receiver_id === currentUserId)
                    )
                )
                // Exclude users with accepted requests (friendship in either direction)
                .filter(user =>
                    !acceptedRequests.some(request =>
                        (request.sender_id === currentUserId && request.receiver_id === user.id) ||
                        (request.sender_id === user.id && request.receiver_id === currentUserId)
                    )
                )
                .map((user, index) => (
                    <div key={`${user.id}-${index}`}>
                        <img 
                            src={"http://127.0.0.1:8000/storage/"+user.profile_picture || 'http://127.0.0.1:8000/storage/default-profile.png'} 
                            alt={user.username}
                        />
                        <p>{user.fullname}</p>
                        <button onClick={() => handleSendRequest(user.id)}>request</button> 
                    </div>
                ))}
        </div>
    );
};

export default Suggestions;