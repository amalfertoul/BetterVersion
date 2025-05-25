import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/user-performance';

// Helper function to get the token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
    };
};

// Async thunk to fetch user performance data
export const fetchUserPerformance = createAsyncThunk(
    'userPerformance/fetchUserPerformance',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                return rejectWithValue('Unauthorized: Please log in.');
            }
            return rejectWithValue(error.response?.data || 'Failed to fetch user performance.');
        }
    }
);
 
const TASKS_API_URL = 'http://localhost:8000/api/tasks'; 
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    const response = await axios.get(TASKS_API_URL);
    return response.data;
});

const initialState = {
    completedTasks: [],
    incompletedTasks: [],
    totalTasks: 0,
    completedPercentage: 0,
    incompletedPercentage: 0,
    performanceStatus: '',
    status: 'idle', // 'loading', 'succeeded', 'failed'
    error: null,
};

const userPerformanceSlice = createSlice({
    name: 'userPerformance',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch user performance
            .addCase(fetchUserPerformance.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUserPerformance.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const tasks = action.payload;

                // Calculate total tasks
                state.totalTasks = tasks.length;

                // Categorize tasks based on status
                state.completedTasks = tasks.filter((task) => task.status === 'completed');
                state.incompletedTasks = tasks.filter((task) => task.status !== 'completed');

                // Calculate percentages
                state.completedPercentage = state.totalTasks
                    ? (state.completedTasks.length / state.totalTasks) * 100
                    : 0;
                state.incompletedPercentage = state.totalTasks
                    ? (state.incompletedTasks.length / state.totalTasks) * 100
                    : 0;

                // Set performance status
                state.performanceStatus =
                    state.completedPercentage >= 80
                        ? 'Excellent'
                        : state.completedPercentage >= 50
                        ? 'Good'
                        : 'Needs Improvement';
            })
            .addCase(fetchUserPerformance.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default userPerformanceSlice.reducer;

