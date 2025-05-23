import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../slices/UserSlice';
import { fetchTasks, createTask, updateTask, deleteTask } from '../slices/taskSlice';

const TodoListPage = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.users.userId);
    const { tasks, loading = false, error = null } = useSelector((state) => state.tasks || {});
    const users = useSelector((state) => state.users.users) || [];

    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('pending');

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        if (userId) {
            dispatch(fetchTasks());
        }
    }, [dispatch, userId]);

    const handleCreateTask = (e) => {
        e.preventDefault();
        if (!taskTitle || !taskDescription || !dueDate) return;

        const newTask = {
            title: taskTitle,
            description: taskDescription,
            due_date: dueDate,
            status,
            user_id: userId,
        };

        dispatch(createTask(newTask));
        setTaskTitle('');
        setTaskDescription('');
        setDueDate('');
        setStatus('pending');
    };

    const handleUpdateTask = (taskId, updatedData) => {
        dispatch(updateTask({ id: taskId, taskData: updatedData }));
    };

    const handleDeleteTask = (taskId) => {
        dispatch(deleteTask(taskId));
    };

    console.log('tasks:', tasks);
    console.log('userId:', userId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="todo-list-page">
            <h1>Your Tasks</h1>
            <form onSubmit={handleCreateTask}>
                <div>
                    <input
                        type="text"
                        placeholder="Task Title"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                    />
                </div>
                <div>
                    <textarea
                        placeholder="Task Description"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
                <div>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <button type="submit">Create Task</button>
            </form>

            <div className="tasks">
                {Array.isArray(tasks) && tasks
                    .filter((task) => Number(task.user_id) === Number(userId))
                    .map((task) => (
                        <div key={task.id} className="task">
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <p>Status: {task.status}</p>
                            <p>Due: {new Date(task.due_date).toLocaleString()}</p>
                            <button onClick={() => handleUpdateTask(task.id, { status: 'completed' })}>
                                Mark as Completed
                            </button>
                            <button onClick={() => handleDeleteTask(task.id)}>Delete Task</button>
                        </div>
                    ))}
            </div>

           
        </div>
    );
};

export default TodoListPage;
