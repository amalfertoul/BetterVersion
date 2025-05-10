import React from 'react';
import ChatsTesting from '../sections/chats';
import FriendRequest from '../sections/friendRequest';
import FriendsList from '../sections/friendsList';
import Suggestions from '../sections/suggestions';

const Socialize = () => {
    return (
        <div>
            <ChatsTesting />
            <FriendRequest />
            <FriendsList />
            <Suggestions />        
        </div>
    );
};

export default Socialize;