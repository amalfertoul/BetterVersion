import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUsers } from '../slices/UserSlice';
import { fetchTasksByUser, createTask, updateTask, deleteTask } from '../slices/taskSlice';
import { fetchVisionBoards, addVisionBoardToTask } from '../slices/visionBoardSlice';
import { fetchImages } from '../slices/imagesSlice';
import '../style/todolist.css'; // Ou './TodoListPage.css' selon votre structure

const CATEGORIES = ['daily', 'weekly', 'monthly', 'yearly'];

const TodoListPage = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.users.user?.id);
    const { tasks, loading, error, searchQuery } = useSelector((state) => state.tasks);
    const { visionBoards } = useSelector((state) => state.visionBoard);
    const { images } = useSelector((state) => state.images);

    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('pending');
    const [category, setCategory] = useState('daily');
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [showVisionBoardsForTask, setShowVisionBoardsForTask] = useState(null);
    const [availableVisionBoards, setAvailableVisionBoards] = useState([]);

    // For editing
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editStatus, setEditStatus] = useState('pending');
    const [editCategory, setEditCategory] = useState('daily');

    // Active category for filtering
    const [activeCategory, setActiveCategory] = useState('all');

    const [isTaskFormExpanded, setIsTaskFormExpanded] = useState(false);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        if (userId) {
            dispatch(fetchTasksByUser(userId));
        }
    }, [dispatch, userId]);

    useEffect(() => {
        if (userId) {
            dispatch(fetchVisionBoards());
            dispatch(fetchImages());
        }
    }, [dispatch, userId]);

    useEffect(() => {
        if (visionBoards && userId) {
            // Affiche tous les vision boards de l'utilisateur
            const filtered = visionBoards.filter(board => board.user_id === userId);
            setAvailableVisionBoards(filtered);
        }
    }, [visionBoards, userId]);

    const handleCreateTask = (e) => {
        e.preventDefault();
        if (!taskTitle || !taskDescription || !dueDate) return;

        const newTask = {
            title: taskTitle,
            description: taskDescription,
            due_date: dueDate,
            status,
            category,
            user_id: userId,
        };

        dispatch(createTask(newTask)).then(() => {
            dispatch(fetchTasksByUser(userId));
        });
        setTaskTitle('');
        setTaskDescription('');
        setDueDate('');
        setStatus('pending');
        setCategory('daily');
    };

    const startEdit = (task) => {
        setEditTaskId(task.id);
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditStatus(task.status);
        setEditCategory(task.category || 'daily');
    };

    const handleUpdateTask = (e) => {
        e.preventDefault();
        dispatch(updateTask({
            id: editTaskId,
            taskData: {
                title: editTitle,
                description: editDescription,
                status: editStatus,
                category: editCategory,
            }
        })).then(() => {
            dispatch(fetchTasksByUser(userId));
        });
        setEditTaskId(null);
    };

    const handleDeleteTask = (taskId) => {
        dispatch(deleteTask(taskId)).then(() => {
            dispatch(fetchTasksByUser(userId));
            dispatch(fetchVisionBoards());
        });
    };

    const markAsCompleted = (task) => {
        dispatch(updateTask({
            id: task.id,
            taskData: { ...task, status: 'completed' }
        })).then(() => {
            dispatch(fetchTasksByUser(userId));
        });
    };

    const toggleDescription = (taskId) => {
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    };

    const toggleVisionBoardsForTask = (taskId) => {
        setShowVisionBoardsForTask(showVisionBoardsForTask === taskId ? null : taskId);
    };

    const handleAddVisionBoardToTask = async (taskId, visionBoardId) => {
        try {
            await dispatch(addVisionBoardToTask({
                taskId,
                visionBoardData: { id: visionBoardId }
            }));
            dispatch(fetchTasksByUser(userId));
            dispatch(fetchVisionBoards());
            setShowVisionBoardsForTask(null);
        } catch (error) {
            console.error('Error adding vision board to task:', error);
        }
    };

    // Filter tasks by category and search
    const filteredTasks = Array.isArray(tasks)
        ? tasks.filter(
            (task) =>
                (activeCategory === 'all' || task.category === activeCategory) &&
                task.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    // Progress calculation
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(task => task.status === 'completed').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {typeof error === 'string' ? error : error.message || JSON.stringify(error)}</div>;

    return (
        <div className="todo-container">
            {/* Header Section */}
            <header className="app-header">
                <div className="logo-section">
                    <div className="logo">TaskFlow</div>
                    <div className="progress-container">
                        <div className="progress-label">Your Progress</div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="progress-percent">{progress}% completed</div>
                    </div>
                </div>
            </header>

            {/* Category Navigation */}
            <nav className="category-nav">
                <div className="category-tabs">
                    <button
                        className={`tab-item ${activeCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveCategory('all')}
                    >
                        All Tasks
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`tab-item ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content */}
            <main className="content-area">
                {/* Task Creation Panel */}
                <section className={`task-creation-panel ${isTaskFormExpanded ? 'expanded' : ''}`}>
                    <h2>Create New Task</h2>
                    <button 
                        className="close-task-btn"
                        onClick={() => setIsTaskFormExpanded(false)}
                    >
                        −
                    </button>
                    <form onSubmit={handleCreateTask} className="task-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    placeholder="Task title"
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Due Date</label>
                                <input
                                    type="datetime-local"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea
                                    placeholder="Task details..."
                                    value={taskDescription}
                                    onChange={(e) => setTaskDescription(e.target.value)}
                                    required
                                    rows="3"
                                />
                            </div>
                        </div>
                        <button type="submit" className="create-btn">
                            + Add Task
                        </button>
                    </form>
                </section>

                {/* Tasks List */}
                <section className="tasks-section">
                    <div className="tasks-header">
                        <h2>{activeCategory === 'all' 
                            ? 'All Tasks' 
                            : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Tasks`}
                        </h2>
                        {!isTaskFormExpanded && (
                            <button 
                                className="add-task-btn"
                                onClick={() => setIsTaskFormExpanded(true)}
                            >
                                +
                            </button>
                        )}
                    </div>
                    <div className="tasks-list">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task) =>
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    editTaskId={editTaskId}
                                    editTitle={editTitle}
                                    editDescription={editDescription}
                                    editStatus={editStatus}
                                    editCategory={editCategory}
                                    expandedTaskId={expandedTaskId}
                                    showVisionBoardsForTask={showVisionBoardsForTask}
                                    availableVisionBoards={availableVisionBoards}
                                    visionBoards={visionBoards}
                                    images={images}
                                    startEdit={startEdit}
                                    setEditTitle={setEditTitle}
                                    setEditDescription={setEditDescription}
                                    setEditStatus={setEditStatus}
                                    setEditCategory={setEditCategory}
                                    setEditTaskId={setEditTaskId}
                                    handleUpdateTask={handleUpdateTask}
                                    handleDeleteTask={handleDeleteTask}
                                    markAsCompleted={markAsCompleted}
                                    toggleDescription={toggleDescription}
                                    toggleVisionBoardsForTask={toggleVisionBoardsForTask}
                                    handleAddVisionBoardToTask={handleAddVisionBoardToTask}
                                />
                            )
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">📋</div>
                                <h3>No tasks found</h3>
                                <p>Create your first task to get started!</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

// TaskItem component
const TaskItem = ({
    task, editTaskId, editTitle, editDescription, editStatus, editCategory,
    expandedTaskId, showVisionBoardsForTask, availableVisionBoards, visionBoards, images,
    startEdit, setEditTitle, setEditDescription, setEditStatus, setEditCategory, setEditTaskId,
    handleUpdateTask, handleDeleteTask, markAsCompleted, toggleDescription, toggleVisionBoardsForTask,
    handleAddVisionBoardToTask
}) => {
    if (editTaskId === task.id) {
        return (
            <div className="task-card editing">
                <form onSubmit={handleUpdateTask} className="edit-task-form">
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                    />
                    <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        required
                    />
                    <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditTaskId(null)}>Cancel</button>
                </form>
            </div>
        );
    }

    return (
        <div className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}>
            <div className="task-main">
                <div className="task-title" onClick={() => toggleDescription(task.id)}>
                    {task.title}
                </div>
                <div className="task-meta">
                    <span className="task-category">
                        {task.category ? task.category.charAt(0).toUpperCase() + task.category.slice(1) : 'Daily'}
                    </span>
                    <span className="task-status">{task.status}</span>
                </div>
                <div className="task-actions">
                    <button onClick={() => startEdit(task)}>Edit</button>
                    {task.status !== 'completed' && (
                        <button onClick={() => markAsCompleted(task)}>Complete</button>
                    )}
                    <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    <button onClick={() => toggleVisionBoardsForTask(task.id)}>
                        {showVisionBoardsForTask === task.id ? 'Hide Vision Boards' : 'Add Vision Board'}
                    </button>
                </div>
            </div>
            {expandedTaskId === task.id && (
                <div className="task-details">
                    <p>{task.description}</p>
                    <p>Due: {new Date(task.due_date).toLocaleString()}</p>
                    <div className="attached-vision-boards">
                        <h4>Attached Vision Boards:</h4>
                        {visionBoards.filter(board => board.task_id === task.id).length > 0 ? (
                            <ul>
                                {visionBoards
                                    .filter(board => board.task_id === task.id)
                                    .map(board => {
                                        const boardImages = images
                                            .filter(img => img.vision_board_id === board.id)
                                            .slice(0, 3);
                                        const placeholders = 3 - boardImages.length;
                                        return (
                                            <li key={board.id}>
                                                <div className="vision-board-title">
                                                    <Link to={`/vision-board/${board.id}`}>
                                                        {board.name}
                                                    </Link>
                                                </div>
                                                <div className="vision-board-images">
                                                    {boardImages.map(img => (
                                                        <img
                                                            key={img.id}
                                                            src={`http://127.0.0.1:8000/storage/${img.url}`}
                                                            alt={img.description || ''}
                                                        />
                                                    ))}
                                                    {[...Array(placeholders)].map((_, idx) => (
                                                        <div key={`ph-${board.id}-${idx}`} className="vision-board-placeholder" />
                                                    ))}
                                                </div>
                                            </li>
                                        );
                                    })}
                            </ul>
                        ) : (
                            <span className="no-vision-boards">None</span>
                        )}
                    </div>
                </div>
            )}
            {showVisionBoardsForTask === task.id && (
                <div className="available-vision-boards">
                    <h4>Available Vision Boards:</h4>
                    {availableVisionBoards.length > 0 ? (
                        <ul>
                            {availableVisionBoards
                                // Filtrer les vision boards déjà attachés à cette tâche
                                .filter(board => board.task_id !== task.id)
                                .map(board => (
                                    <li key={board.id}>
                                        {board.name}
                                        <button onClick={() => handleAddVisionBoardToTask(task.id, board.id)}>
                                            Add to Task
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <p>No available vision boards. Create one first.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default TodoListPage;