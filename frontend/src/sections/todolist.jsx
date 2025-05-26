import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../slices/UserSlice';
import { fetchTasks, createTask, updateTask, deleteTask } from '../slices/taskSlice';

const CATEGORIES = ['daily', 'weekly', 'monthly', 'yearly']; // Updated from 'MODES' to 'CATEGORIES'

const TodoListPage = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.users.userId);
    const { tasks, loading, error } = useSelector((state) => state.tasks);

    // Form state
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('pending');
    const [category, setCategory] = useState('daily'); // Changed from 'mode'
    const [search, setSearch] = useState('');
    const [expandedTaskId, setExpandedTaskId] = useState(null);

    // Edit state
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editStatus, setEditStatus] = useState('pending');
    const [editCategory, setEditCategory] = useState('daily'); // Changed from 'editMode'

    // Fetch tasks on mount and when userId changes
    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchTasks());
    }, [dispatch]);

    useEffect(() => {
        if (userId) dispatch(fetchTasks());
    }, [dispatch, userId]);

    // Create a new task
    const handleCreateTask = (e) => {
        e.preventDefault();
        if (!taskTitle || !taskDescription || !dueDate) return;

        const newTask = {
            title: taskTitle,
            description: taskDescription,
            due_date: dueDate, // Ensure Laravel expects this field name
            status,
            category, // Changed from 'mode'
            user_id: userId,
        };

        dispatch(createTask(newTask));
        // Reset form
        setTaskTitle('');
        setTaskDescription('');
        setDueDate('');
        setStatus('pending');
        setCategory('daily');
    };

    // Edit handlers
    const startEdit = (task) => {
        setEditTaskId(task.id);
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditStatus(task.status);
        setEditCategory(task.category || 'daily'); // Changed from 'mode'
    };

    const handleUpdateTask = (e) => {
        e.preventDefault();
        const taskToUpdate = tasks.find(task => task.id === editTaskId); // Find the original task
        dispatch(updateTask({
            id: editTaskId,
            taskData: {
                title: editTitle,
                description: editDescription,
                status: editStatus,
                category: editCategory,
                due_date: taskToUpdate.due_date, // Preserve original due date
            }
        }));
        setEditTaskId(null); // Exit edit mode
    };

    const handleDeleteTask = (taskId) => {
        dispatch(deleteTask(taskId));
    };

    const markAsCompleted = (task) => {
        dispatch(updateTask({
            id: task.id,
            taskData: { ...task, status: 'completed' }
        }));
    };

    const toggleDescription = (taskId) => {
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    };

    // Filter tasks by current user and search query
    const filteredTasks = Array.isArray(tasks)
        ? tasks.filter(
            (task) =>
                Number(task.user_id) === Number(userId) &&
                task.title.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    // Progress calculation
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(task => task.status === 'completed').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="todo-list-page">
            <h1>Your Tasks</h1>
            
            {/* Progress Bar */}
            <div style={{ margin: '20px 0' }}>
                <div style={{ background: '#eee', borderRadius: 8, height: 24, width: 300 }}>
                    <div
                        style={{
                            width: `${progress}%`,
                            background: '#4caf50',
                            height: '100%',
                            borderRadius: 8,
                            transition: 'width 0.3s'
                        }}
                    />
                </div>
                <div style={{ marginTop: 4 }}>{progress}% completed</div>
            </div>

            {/* Task Creation Form */}
            <form onSubmit={handleCreateTask}>
                <div>
                    <input
                        type="text"
                        placeholder="Task Title"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <textarea
                        placeholder="Task Description"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Create Task</button>
            </form>

            {/* Search */}
            <div style={{ margin: '20px 0' }}>
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Tasks Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 30 }}>
                <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Task</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Category</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Status</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) =>
                            editTaskId === task.id ? (
                                <tr key={task.id} style={{ background: '#fffbe0' }}>
                                    <td colSpan={4}>
                                        <form onSubmit={handleUpdateTask} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                required
                                                style={{ flex: 1 }}
                                            />
                                            <textarea
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                required
                                                style={{ flex: 1 }}
                                            />
                                            <select 
                                                value={editStatus} 
                                                onChange={(e) => setEditStatus(e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                            <select 
                                                value={editCategory} 
                                                onChange={(e) => setEditCategory(e.target.value)}
                                            >
                                                {CATEGORIES.map(cat => (
                                                    <option key={cat} value={cat}>
                                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                            <button type="submit">Save</button>
                                            <button type="button" onClick={() => setEditTaskId(null)}>
                                                Cancel
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={task.id} style={{ background: task.status === 'completed' ? '#e0ffe0' : '#fff' }}>
                                    <td style={{ border: '1px solid #ccc', padding: 8 }}>
                                        <div 
                                            style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                            onClick={() => toggleDescription(task.id)}
                                        >
                                            {task.title}
                                        </div>
                                        {expandedTaskId === task.id && (
                                            <div style={{ marginTop: '8px', padding: '8px', background: '#f8f8f8' }}>
                                                <p>{task.description}</p>
                                                <p>Due: {new Date(task.due_date).toLocaleString()}</p>
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: 8 }}>
                                        {(task.category || 'daily').charAt(0).toUpperCase() + (task.category || 'daily').slice(1)}
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: 8 }}>
                                        {task.status}
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: 8 }}>
                                        <button onClick={() => startEdit(task)}>Edit</button>
                                        {task.status !== 'completed' && (
                                            <button onClick={() => markAsCompleted(task)}>Complete</button>
                                        )}
                                        <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                                    </td>
                                </tr>
                            )
                        )
                    ) : (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>
                                No tasks found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TodoListPage;