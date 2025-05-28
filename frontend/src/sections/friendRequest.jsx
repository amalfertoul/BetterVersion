import React from "react";
import { useDispatch , useSelector } from "react-redux";
import { fetchFriendRequests , updateFriendRequest , deleteFriendRequest} from "../slices/friendRequestSlice";
import { fetchUsers } from "../slices/UserSlice"; 
import { useEffect } from "react";

// hadi component li katalae nas li msardinlk tn ka user
const FriendRequest = () => {
    const dispatch = useDispatch(); 

    const currentUserId = useSelector((state) => state.users.user?.id); // hna kanjibo userId dyal user li da5el bach nfiltriw bih ela table pending
    const { pending, status: requestStatus } = useSelector((state) => state.friendRequests); // hna kanjibo pending requests o status dyalom 
    const users = useSelector((state) => state.users.users);// table users mn UserSlice bach ntaleo les info d senders


    useEffect(() => {
        dispatch(fetchFriendRequests());
        dispatch(fetchUsers());
    }, [dispatch]);

    // hna kanfilteriw requests li receiver dyalhom howa user li da5el
    const receivedRequests = pending
    .filter(request => request.receiver_id === currentUserId)
    .map(request => {
        const sender = users.find(user => user.id === request.sender_id);

        return {
            id: request.id,
            sender_id: request.sender_id,
            sender_name: sender 
                ? sender.first_name && sender.last_name 
                    ? `${sender.first_name} ${sender.last_name}`
                    : sender.fullname || "Unknown User"
                : "Unknown User"
        };
    });
    
    const handleAccept = (id) => {
        dispatch(updateFriendRequest({ id, status: "accepted" }));
    };

    const handleDecline = (id) => {
        dispatch(deleteFriendRequest(id));
    };
    

    return (
        <div>
        <ul className="space-y-4">
            {receivedRequests.map((request) => (
                <li key={request.id} className="flex items-center space-x-4">
                    {/* mn b3d zido hta tswira dialo */}
                    <span className="font-medium">
                        {request.sender_name} 
                    </span> 
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleAccept(request.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => handleDecline(request.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                            Decline
                        </button>
                    </div>
                </li>
            ))}
            
        </ul>

        {/* Display message when no pending requests */}
        {receivedRequests.length === 0 && requestStatus === 'succeeded' && (
            <p className="text-gray-500 mt-4">No pending requests received.</p>
        )}
    </div>
    );

};

export default FriendRequest; // export component