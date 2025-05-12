import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../slices/UserSlice';
import { fetchUserPerformance } from '../slices/userPerformanceSlice';
import { Link } from 'react-router-dom';

const Profile = () => {
    const dispatch = useDispatch();
    const currentUserId = useSelector((state) => state.users.userId);
    const users = useSelector((state) => state.users.users);
    const { 
        completedTasks, 
        incompletedTasks, 
        totalTasks, 
        completedPercentage, 
        performanceStatus,
        status: performanceStatusLoading 
    } = useSelector((state) => state.userPerformance);
    
    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchUserPerformance());
    }, [dispatch]);

    // Find the current user's data
    const currentUser = users.find(user => user.id === currentUserId);

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h2>My Profile</h2>
                    <Link to="/friendslist" className="friends-link">
                        My Friends List
                    </Link>
                </div>
                
                {currentUser ? (
                    <div>
                        <div >
                            {currentUser.avatar ? (
                                <img src={currentUser.avatar} alt="Profile" />
                            ) : (
                                <div className="default-avatar">
                                    {currentUser.username?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>
                        
                        <div >
                            <div >
                                <span>{currentUser.username || 'Not set'}</span>
                            </div>
                        </div>

                        {/* Performance Section */}
                        <div >
                            <h3>My Performance</h3>
                            {performanceStatusLoading === 'loading' ? (
                                <div className="loading">Loading performance data...</div>
                            ) : (
                                <div >
                                    <div>
                                        <h4>Task Completion</h4>
                                        <div >
                                            <div 
                                                style={{ width: `${completedPercentage}%` }}
                                            ></div>
                                        </div>
                                        <p>{completedPercentage.toFixed(1)}% Completed</p>
                                    </div>
                                    
                                    <div>
                                        <h4>Performance Status</h4>
                                        <p className={`status ${performanceStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                                            {performanceStatus}
                                        </p>
                                        <div className="status-description">
                                            {performanceStatus === 'Excellent' && 
                                                'Félicitations ! Vous maintenez un excellent niveau de performance.'}
                                            {performanceStatus === 'Très Bien' && 
                                                'Excellent travail ! Vous êtes sur la bonne voie.'}
                                            {performanceStatus === 'Bien' && 
                                                'Vous faites du bon travail, continuez ainsi !'}
                                            {performanceStatus === 'Moyen' && 
                                                'Vous pouvez faire mieux, ne lâchez rien !'}
                                            {performanceStatus === 'À Améliorer' && 
                                                'Concentrez-vous sur la complétion de vos tâches pour améliorer votre performance.'}
                                        </div>
                                    </div>

                                    <div>
                                        <h4>Tasks Overview</h4>
                                        <div >
                                            <div >
                                                <span >{totalTasks}</span>
                                                <span >Total Tasks</span>
                                            </div>
                                            <div>
                                                <span >{completedTasks.length}</span>
                                                <span >Completed</span>
                                            </div>
                                            <div >
                                                <span >{incompletedTasks.length}</span>
                                                <span >Incomplete</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="loading">Loading profile...</div>
                )}
            </div>

        </div>
    );
};

export default Profile;
