import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '../slices/UserSlice'; 
import { fetchUserPerformance } from '../slices/userPerformanceSlice';
import { fetchTasks } from '../slices/taskSlice';

const AdminOnly = () => {
  const dispatch = useDispatch();
  const [userFilter, setUserFilter] = useState('');

  const users = useSelector((state) => state.users.users);
  const loading = useSelector((state) => state.users.loading);
  const error = useSelector((state) => state.users.error);
  const userPerformance = useSelector((state) => state.userPerformance || {});
  const tasks = useSelector((state) => state.tasks.tasks);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchUserPerformance());
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  const filteredUsers = users.filter(
    user =>
      user.email?.toLowerCase().includes(userFilter.toLowerCase()) ||
      user.username?.toLowerCase().includes(userFilter.toLowerCase())
  );

  const getPerformanceColor = (status) => {
    switch(status) {
      case 'Excellent': return { color: '#155724', bgColor: '#d4edda' };
      case 'Good': return { color: '#856404', bgColor: '#fff3cd' };
      case 'Needs Improvement': return { color: '#721c24', bgColor: '#f8d7da' };
      default: return { color: '#333', bgColor: '#eee' };
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <div className="controls">
          <span className="user-count">Total Users: <strong>{filteredUsers.length}</strong></span>
          <button 
            className="refresh-btn"
            onClick={() => {
              dispatch(fetchUsers());
              dispatch(fetchUserPerformance());
              dispatch(fetchTasks());
            }}
          >
            Refresh Data
          </button>
        </div>
      </header>

      <div className="filter-section">
        <input
          type="text"
          placeholder="🔍 Filter by email or username"
          value={userFilter}
          onChange={e => setUserFilter(e.target.value)}
        />
      </div>

      {loading && <div className="loading-bar"><div className="progress"></div></div>}
      {error && <div className="error-message">Error: {error}</div>}

      <div className="user-grid">
        {!loading && !error && filteredUsers.length === 0 && (
          <div className="no-results">
            No users found matching your filter
          </div>
        )}

        {!loading && !error && filteredUsers.map((user) => {
          const userTasks = tasks.filter(t => t.user_id === user.id);
          const completedTasks = userTasks.filter(t => t.status === 'completed');
          const totalTasks = userTasks.length;
          const completedPercentage = totalTasks ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
          
          let performanceStatus = 'N/A';
          if (totalTasks > 0) {
            if (completedPercentage >= 80) performanceStatus = 'Excellent';
            else if (completedPercentage >= 50) performanceStatus = 'Good';
            else performanceStatus = 'Needs Improvement';
          }

          const perfStyle = getPerformanceColor(performanceStatus);

          return (
            <div className="user-card" key={user.id}>
              <div className="card-header">
                <div className="user-avatar">
                  {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <div className="username">{user.username || 'No username'}</div>
                  <div className="email">{user.email}</div>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user.id)}
                  aria-label="delete user"
                >
                  🗑️
                </button>
              </div>
              
              <div className="card-body">
                <div className="progress-section">
                  <div className="progress-label">Task Completion: {completedPercentage}%</div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${completedPercentage}%` }}
                      data-percentage={completedPercentage}
                    ></div>
                  </div>
                </div>
                
                <div className="stats-container">
                  <div className="stat-box">
                    <div className="stat-label">Total Tasks</div>
                    <div className="stat-value">{totalTasks}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Performance</div>
                    <div 
                      className="performance-tag"
                      style={{ 
                        color: perfStyle.color,
                        backgroundColor: perfStyle.bgColor 
                      }}
                    >
                      {performanceStatus}
                    </div>
                  </div>
                </div>
                
                <div className="tasks-section">
                  <h4>✅ Completed Tasks</h4>
                  {completedTasks.length > 0 ? (
                    <ul className="task-list">
                      {completedTasks.map(task => (
                        <li key={task.id} className="task-item">
                          <span className="task-title">{task.title}</span>
                          <span className="task-due">
                            (Due: {new Date(task.due_date).toLocaleDateString()})
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="no-tasks">No completed tasks</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <style jsx>{`
        .admin-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .dashboard-header h2 {
          font-size: 28px;
          margin: 0;
          color: #2c3e50;
        }
        
        .controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .user-count {
          font-size: 16px;
        }
        
        .refresh-btn {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .refresh-btn:hover {
          background-color: #2980b9;
        }
        
        .filter-section {
          margin-bottom: 25px;
        }
        
        .filter-section input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          box-sizing: border-box;
        }
        
        .loading-bar {
          height: 6px;
          background-color: #f0f0f0;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 20px;
        }
        
        .progress {
          height: 100%;
          width: 60%;
          background-color: #3498db;
          animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-weight: 500;
        }
        
        .user-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
        }
        
        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          background-color: #f8f9fa;
          border-radius: 8px;
          color: #6c757d;
          font-size: 18px;
        }
        
        .user-card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .user-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }
        
        .card-header {
          display: flex;
          align-items: center;
          padding: 20px;
          background-color: #f8f9fa;
          border-bottom: 1px solid #eee;
        }
        
        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #3498db;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          margin-right: 15px;
        }
        
        .user-info {
          flex: 1;
        }
        
        .username {
          font-weight: 600;
          font-size: 18px;
          color: #2c3e50;
        }
        
        .email {
          font-size: 14px;
          color: #7f8c8d;
          margin-top: 4px;
        }
        
        .delete-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #e74c3c;
          padding: 5px;
          transition: transform 0.2s;
        }
        
        .delete-btn:hover {
          transform: scale(1.1);
        }
        
        .card-body {
          padding: 20px;
        }
        
        .progress-section {
          margin-bottom: 20px;
        }
        
        .progress-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          color: #555;
        }
        
        .progress-bar {
          height: 10px;
          background-color: #ecf0f1;
          border-radius: 5px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          border-radius: 5px;
          background: linear-gradient(90deg, #2ecc71, #27ae60);
          transition: width 0.5s ease;
        }
        
        .stats-container {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .stat-box {
          flex: 1;
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 12px;
          text-align: center;
        }
        
        .stat-label {
          font-size: 13px;
          color: #7f8c8d;
          margin-bottom: 5px;
        }
        
        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #2c3e50;
        }
        
        .performance-tag {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }
        
        .tasks-section h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          color: #2c3e50;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .task-list {
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 150px;
          overflow-y: auto;
          border: 1px solid #eee;
          border-radius: 6px;
        }
        
        .task-item {
          padding: 10px 15px;
          border-bottom: 1px solid #eee;
          display: flex;
          flex-direction: column;
        }
        
        .task-item:last-child {
          border-bottom: none;
        }
        
        .task-title {
          font-weight: 500;
          color: #27ae60;
          margin-bottom: 3px;
        }
        
        .task-due {
          font-size: 12px;
          color: #95a5a6;
        }
        
        .no-tasks {
          text-align: center;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 6px;
          color: #95a5a6;
          font-size: 14px;
          border: 1px dashed #ddd;
        }
        
        @media (max-width: 768px) {
          .user-grid {
            grid-template-columns: 1fr;
          }
          
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .controls {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOnly;