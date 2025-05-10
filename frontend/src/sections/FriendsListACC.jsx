import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFriendRequests, deleteFriendRequest } from '../slices/friendRequestSlice';
import { fetchUsers } from '../slices/UserSlice';

const FriendsList = () => {
    const dispatch = useDispatch();
    const currentUserId = useSelector((state) => state.users.userId);
    const users = useSelector((state) => state.users.users);
    const { accepted, status, error } = useSelector((state) => state.friendRequests);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchFriendRequests());
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleDelete = (requestId) => {
        if (window.confirm('Are you sure you want to remove this friend?')) {
            dispatch(deleteFriendRequest(requestId));
        }
    };

    // Filter only accepted friends where current user is either sender or receiver
    const filteredFriends = accepted.filter(request => {
        return request.status === 'accepted'
    });

    // Get friend details for each accepted request
    const friendsList = filteredFriends.map(request => {
        const friendId = request.sender_id === currentUserId ? request.receiver_id : request.sender_id;
        const friend = users.find(user => user.id === friendId);
        return {
            ...request,
            friendDetails: friend
        };
    });

    // Filter friends based on search term
    const filteredFriendsList = friendsList.filter(friend => 
        friend.friendDetails?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.friendDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (status === 'loading') return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="friends-container">
            <h2>My Friends</h2>
            
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search friends..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {filteredFriendsList.length === 0 ? (
                <div className="no-friends">
                    <p>{searchTerm ? 'No friends found matching your search' : 'No friends yet'}</p>
                </div>
            ) : (
                <ul className="friends-list">
                    {filteredFriendsList.map(friend => (
                        <li key={friend.id} className="friend-item">
                            <div className="friend-info">
                                <span className="friend-name">
                                    {friend.friendDetails?.username || 'Unknown User'}
                                </span>
                                <span className="friend-email">
                                    {friend.friendDetails?.email || ''}
                                </span>
                            </div>
                            <button 
                                className="delete-friend"
                                onClick={() => handleDelete(friend.id)}
                            >
                                Remove Friend
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <style>{`
                .friends-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }

                .search-container {
                    margin: 20px 0;
                }

                .search-input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 16px;
                    transition: border-color 0.3s ease;
                }

                .search-input:focus {
                    outline: none;
                    border-color: #4CAF50;
                    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
                }

                .friends-list {
                    list-style: none;
                    padding: 0;
                }

                .friend-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px;
                    margin-bottom: 10px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .friend-info {
                    display: flex;
                    flex-direction: column;
                }

                .friend-name {
                    font-weight: bold;
                    color: #333;
                }

                .friend-email {
                    color: #666;
                    font-size: 0.9em;
                }

                .delete-friend {
                    padding: 8px 16px;
                    background-color: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .delete-friend:hover {
                    background-color: #c82333;
                }

                .no-friends {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                }

                .loading {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                }

                .error {
                    text-align: center;
                    padding: 20px;
                    color: #dc3545;
                }
            `}</style>
        </div>
    );
};

export default FriendsList;