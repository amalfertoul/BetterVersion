import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../slices/UserSlice';
import { fetchImages } from '../slices/imagesSlice';
import { fetchTasks } from '../slices/userPerformanceSlice';
import { useParams } from 'react-router-dom';

const FriendPfp = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const users = useSelector((state) => state.users.users);
    const { images } = useSelector((state) => state.images);
    const {
        completedTasks,
        incompletedTasks,
        totalTasks,
        completedPercentage,
        performanceStatus,
        status: performanceStatusLoading
    } = useSelector((state) => state.userPerformance);

    const currentUserId = parseInt(id);
    const currentUser = users.find(user => user.id === currentUserId);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchImages());
        dispatch(fetchTasks(currentUserId));
    }, [dispatch]);

    return (
        <div>
            {currentUser ? (
                <div className="profile-content">
                    <div className="profile-avatar">
                        {currentUser.avatar ? (
                            <img src={currentUser.avatar} alt="Profile" />
                        ) : (
                            <div className="default-avatar">
                                {currentUser.username?.charAt(0) || 'U'}
                            </div>
                        )}
                    </div>

                    <div className="profile-info">
                        <div className="info-item">
                            <span>{currentUser.username || 'Not set'}</span>
                        </div>

                        {/* Performance Section */}
                        <div className="performance-section">
                            <h3>My Performance</h3>
                            {performanceStatusLoading === 'loading' ? (
                                <div className="loading">Loading performance data...</div>
                            ) : (
                                <div className="performance-stats">
                                    <div className="stat-item">
                                        <h4>Task Completion</h4>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${completedPercentage}%` }}
                                            ></div>
                                        </div>
                                        <p>{completedPercentage.toFixed(1)}% Completed</p>
                                    </div>

                                    <div className="stat-item">
                                        <h4>Performance Status</h4>
                                        <p className={`status ${performanceStatus.toLowerCase().replace(/\s/g, '-')}`}>
                                            {performanceStatus}
                                        </p>
                                        <div className="status-description">
                                            {performanceStatus === 'Excellent' &&
                                                "Great job! You're completing most of your tasks."}
                                            {performanceStatus === 'Good' &&
                                                "You're doing well, but there's room for improvement."}
                                            {performanceStatus === 'Needs Improvement' &&
                                                'Try to complete more tasks to improve your performance.'}
                                        </div>
                                    </div>

                                    <div className="stat-item">
                                        <h4>Tasks Overview</h4>
                                        <div className="tasks-breakdown">
                                            <div className="task-count">
                                                <span className="count">{totalTasks}</span>
                                                <span className="label">Total Tasks</span>
                                            </div>
                                            <div className="task-count completed">
                                                <span className="count">{completedTasks.length}</span>
                                                <span className="label">Completed</span>
                                            </div>
                                            <div className="task-count incomplete">
                                                <span className="count">{incompletedTasks.length}</span>
                                                <span className="label">Incomplete</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div>User not found</div>
            )}
            <style>{`
                .profile-container {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .profile-card {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    padding: 20px;
                }

                .profile-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #eee;
                }

                .friends-link {
                    padding: 8px 16px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                    transition: background-color 0.3s;
                }

                .friends-link:hover {
                    background-color: #45a049;
                }

                .performance-section {
                    margin: 20px 0;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                .performance-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-top: 15px;
                }

                .stat-item {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .stat-item h4 {
                    color: #333;
                    margin-bottom: 15px;
                    font-size: 1.1em;
                }

                .progress-bar {
                    width: 100%;
                    height: 20px;
                    background: #e9ecef;
                    border-radius: 10px;
                    overflow: hidden;
                    margin: 10px 0;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #4CAF50, #45a049);
                    transition: width 0.3s ease;
                }

                .status {
                    font-weight: bold;
                    padding: 8px 12px;
                    border-radius: 4px;
                    display: inline-block;
                    margin-bottom: 10px;
                }

                .status.excellent {
                    background: #d4edda;
                    color: #155724;
                }

                .status.good {
                    background: #fff3cd;
                    color: #856404;
                }

                .status.needs-improvement {
                    background: #f8d7da;
                    color: #721c24;
                }

                .status-description {
                    font-size: 0.9em;
                    color: #666;
                    margin-top: 10px;
                }

                .tasks-breakdown {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    text-align: center;
                }

                .task-count {
                    padding: 10px;
                    border-radius: 6px;
                    background: #f8f9fa;
                }

                .task-count .count {
                    display: block;
                    font-size: 1.5em;
                    font-weight: bold;
                    color: #333;
                }

                .task-count .label {
                    font-size: 0.9em;
                    color: #666;
                }

                .task-count.completed {
                    background: #d4edda;
                }

                .task-count.incomplete {
                    background: #f8d7da;
                }

                .loading {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                }

                .visionboard-section {
                    margin: 20px 0;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                .visionboard-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-top: 15px;
                }

                .visionboard-card {
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .vb-form {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 15px;
                    margin-bottom: 20px;
                }

                .vb-form label {
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                .vb-form input,
                .vb-form select {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 1em;
                }

                .vb-form button {
                    padding: 10px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1em;
                    transition: background-color 0.3s;
                }

                .vb-form button:hover {
                    background-color: #0056b3;
                }

                .error-message {
                    color: red;
                    font-size: 0.9em;
                    margin-top: 10px;
                }

                .images-section {
                    margin: 20px 0;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                .user-images-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                }

                .user-image-card {
                    background: white;
                    padding: 10px;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    text-align: center;
                }

                .user-image-card img {
                    width: 100%;
                    border-radius: 8px;
                    object-fit: cover;
                }

                .edit-image-form {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 10px;
                    margin-top: 10px;
                }

                .edit-image-form textarea {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 1em;
                    resize: none;
                }

                .edit-image-form select {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 1em;
                }

                .edit-image-form button {
                    padding: 10px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1em;
                    transition: background-color 0.3s;
                }

                .edit-image-form button:hover {
                    background-color: #0056b3;
                }

                /* ... rest of your existing styles ... */
            `}</style>
        </div>
    );
};

export default FriendPfp;
