import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../slices/UserSlice';
import { createFriendRequest } from '../slices/friendRequestSlice';

const Suggestions = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.users);
    const currentUserId = useSelector((state) => state.users.userId);
    const pendingRequests = useSelector((state) => state.friendRequests.pending);
    const loading = useSelector((state) => state.users.loading);
    const error = useSelector((state) => state.users.error);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);


    const handleSendFriendRequest = (receiverId) => {
        const requestData = {
          sender_id: currentUserId,
          receiver_id: receiverId,
          status: 'pending'
        };
      
        alert('Sending friend request...');
      
        dispatch(createFriendRequest(requestData))
          .unwrap()
          .then((response) => {
            alert('Friend request sent successfully!');
          })
          .catch((error) => {
            alert('Failed to send friend request. Please try again.');
          });
      };
      
      
    

    const filteredUsers = users
        .filter(user => user.id !== currentUserId)
        .slice(0, 30);

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            {/* nas li deja msardinlom hnaya gaema aybqaw ytleo f suggestions mea had lfilter */}
            {filteredUsers
                .filter(user => 
                    !pendingRequests.some(request => 
                        request.receiver_id === user.id && request.sender_id === currentUserId
                    )
                )
                // gha bach mantleochi n rasna hnaya
                .map((user, index) => (
                    <div key={`${user.id}-${index}`}>
                        {/*had leiba d image maeraftchi kfch ntalea meawt*/}
                        <img 
                            src={user.profile_picture || '/default-profile.png'} 
                            alt={user.username}
                        />
                        
                        <p>{user.fullname}</p>
                        <button onClick={() => handleSendFriendRequest(user.id)}>request</button> 
                                            
                    </div>
                ))}
        </div>
    );
};

export default Suggestions;