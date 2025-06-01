import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/tasks';

// Helper function to get the token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
    };
};

// Async thunks for CRUD operations
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch tasks');
    }
});

export const createTask = createAsyncThunk('tasks/createTask', async (taskData, { rejectWithValue }) => {
    try {
        console.log('Task data being sent:', taskData); // Log the task data
        const response = await axios.post(API_URL, taskData, {
            headers: {
                ...getAuthHeaders(), // Include the Authorization header
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating task:', error.response?.data || error.message); // Log the error
        return rejectWithValue(error.response?.data || 'Failed to create task');
    }
});

export const fetchTaskById = createAsyncThunk('tasks/fetchTaskById', async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
});

export const fetchTasksByUser = createAsyncThunk('tasks/fetchTasksByUser', async (userId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/user/${userId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch user tasks');
    }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, taskData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, taskData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to update task');
    }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${id}`, {
            headers: getAuthHeaders(),
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to delete task');
    }
});

// Initial state
const initialState = {
    tasks: [],
    task: null,
    loading: false,
    error: null,
    searchQuery: '',
};

// Task slice
const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        clearSearchQuery: (state) => {
            state.searchQuery = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex((task) => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter((task) => task.id !== action.payload);
            });
    },
});

export const { setSearchQuery, clearSearchQuery } = taskSlice.actions;
export default taskSlice.reducer;