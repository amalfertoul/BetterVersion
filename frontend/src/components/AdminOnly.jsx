import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../slices/UserSlice'; 
import { fetchUserPerformance } from '../slices/userPerformanceSlice';

const AdminOnly = () => {
    const dispatch = useDispatch();

    const users = useSelector((state) => state.users.users);
    const loading = useSelector((state) => state.users.loading);
    const error = useSelector((state) => state.users.error);

    const userPerformance = useSelector((state) => state.userPerformance || {});

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchUserPerformance());
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
                        {users.map((user) => {
                            const perf = userPerformance[user.id] || {};
                            return (
                                <div key={user.id} style={{ marginBottom: 24, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
                                    <p><strong>{user.email}</strong></p>
                                    <div>
                                        <div style={{ marginBottom: 8 }}>
                                            <span>Task Completion: </span>
                                            <div style={{
                                                width: 200,
                                                height: 12,
                                                background: '#e9ecef',
                                                borderRadius: 6,
                                                overflow: 'hidden',
                                                display: 'inline-block',
                                                verticalAlign: 'middle',
                                                marginLeft: 8,
                                                marginRight: 8
                                            }}>
                                                <div style={{
                                                    width: `${perf.completedPercentage || 0}%`,
                                                    height: '100%',
                                                    background: 'linear-gradient(90deg, #4CAF50, #45a049)'
                                                }} />
                                            </div>
                                            <span>{(perf.completedPercentage || 0).toFixed(1)}%</span>
                                        </div>
                                        <div>
                                            <span>Total Tasks: </span>
                                            <strong>{perf.totalTasks ?? 0}</strong>
                                        </div>
                                        <div>
                                            <span>Performance Status: </span>
                                            <span style={{
                                                fontWeight: 'bold',
                                                color: perf.performanceStatus === 'Excellent' ? '#155724'
                                                    : perf.performanceStatus === 'Good' ? '#856404'
                                                    : perf.performanceStatus === 'Needs Improvement' ? '#721c24'
                                                    : '#333',
                                                background: perf.performanceStatus === 'Excellent' ? '#d4edda'
                                                    : perf.performanceStatus === 'Good' ? '#fff3cd'
                                                    : perf.performanceStatus === 'Needs Improvement' ? '#f8d7da'
                                                    : '#eee',
                                                padding: '2px 8px',
                                                borderRadius: 4,
                                                marginLeft: 4
                                            }}>
                                                {perf.performanceStatus || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminOnly;
