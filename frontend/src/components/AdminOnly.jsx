import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../slices/UserSlice'; 

const AdminOnly = () => {
    const dispatch = useDispatch();

    const users = useSelector((state) => state.users.users);
    const loading = useSelector((state) => state.users.loading);
    const error = useSelector((state) => state.users.error);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    return (
        <div>
            <h2>Admin Dashboard</h2>
            {loading && <p>Loading users...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
                <>
                    <p>Total registered users: <strong>{users.length}</strong></p>
                    <div>
                        {users.map((user, index) => (
                            <div key={`${user.id}-${index}`}>
                                <p>{user.email}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminOnly;
