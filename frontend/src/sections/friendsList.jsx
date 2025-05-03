import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFriendRequests, deleteFriendRequest } from '../slices/friendRequestSlice';
import { fetchUsers } from '../slices/UserSlice';

const FriendsList = () => {
    const dispatch = useDispatch();
    const currentUserId = useSelector((state) => state.users.userId);
    const users = useSelector((state) => state.users.users);
    const acceptedRequests = useSelector((state) => state.friendRequests.accepted);

    useEffect(() => {
        dispatch(fetchFriendRequests());
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleDelete = (requestId) => {
        dispatch(deleteFriendRequest(requestId));
    };

    const filteredRequests = acceptedRequests.filter(request => request.receiver_id === currentUserId);

    return (
        <div>
            <h1>Friends List</h1>
            {filteredRequests.length === 0 ? (
                <p>No friends accepted yet.</p>
            ) : (
                <ul>
                    {filteredRequests.map(request => {
                        const sender = users.find(user => user.id === request.sender_id);
                        return (
                            <li key={request.id}>
                                {sender ? sender.fullname : 'Unknown Sender'}
                                <button onClick={() => handleDelete(request.id)}>Remove Friend</button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default FriendsList;