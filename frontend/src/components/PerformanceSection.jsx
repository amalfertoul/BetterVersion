import React from 'react';

const PerformanceSection = ({
    completedPercentage,
    performanceStatus,
    performanceStatusLoading,
    totalTasks,
    completedTasks,
    incompletedTasks,
}) => (
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
                    <p className={`status ${performanceStatus.toLowerCase()}`}>
                        {performanceStatus}
                    </p>
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
);

export default PerformanceSection;