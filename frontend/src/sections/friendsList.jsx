import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFriendRequests, deleteFriendRequest } from '../slices/friendRequestSlice';
import { fetchUsers } from '../slices/UserSlice';
import { useNavigate } from 'react-router-dom';


const FriendsList = () => {
    const dispatch = useDispatch();
    const currentUserId = useSelector((state) => state.users.userId);
    const users = useSelector((state) => state.users.users);
    const acceptedRequests = useSelector((state) => state.friendRequests.accepted);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchFriendRequests());
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleDelete = (requestId) => {
        dispatch(deleteFriendRequest(requestId));
    };

    const handleMessage = (friendId) => {
        navigate(`/conversation/${friendId}`);
    };


    // Show all accepted requests where current user is either sender or receiver
    const filteredRequests = acceptedRequests.filter(
        request => request.sender_id === currentUserId || request.receiver_id === currentUserId
    );

    return (
        <div>
            <h1>Friends List</h1>
            {filteredRequests.length === 0 ? (
                <p>No friends accepted yet.</p>
            ) : (
                <ul>
                    {filteredRequests.map(request => {
                        // Find the other user (not the current user)
                        const friendId = request.sender_id === currentUserId ? request.receiver_id : request.sender_id;
                        const friend = users.find(user => user.id === friendId);
                        return (
                            <li key={request.id}>
                                {friend ? friend.fullname : 'Unknown Friend'}
                                <button onClick={() => handleDelete(request.id)}>Remove Friend</button>
                                  <button onClick={() => handleMessage(friendId)}>Message</button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default FriendsList;