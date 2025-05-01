import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000//api/tasks'; 

// Async thunks for CRUD operations
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const createTask = createAsyncThunk('tasks/createTask', async (taskData) => {
    const response = await axios.post(API_URL, taskData);
    return response.data;
});

export const fetchTaskById = createAsyncThunk('tasks/fetchTaskById', async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, taskData }) => {
    const response = await axios.put(`${API_URL}/${id}`, taskData);
    return response.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});

// Initial state
const initialState = {
    tasks: [],
    task: null,
    loading: false,
    error: null,
};

// Task slice
const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create a task
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.push(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Fetch a task by ID
            .addCase(fetchTaskById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTaskById.fulfilled, (state, action) => {
                state.loading = false;
                state.task = action.payload;
            })
            .addCase(fetchTaskById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update a task
            // ==== hnaya kan9dro nbdlo status dial task w automatiquement kattbdl nisba d userPerformance ilakh ===
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tasks.findIndex((task) => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete a task
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter((task) => task.id !== action.payload);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default taskSlice.reducer;