import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch user performance data
export const fetchUserPerformance = createAsyncThunk(
  'userPerformance/fetchUserPerformance',
  async () => {
    const response = await axios.get('http://localhost:8000/api/user-performance'); 
    return response.data;
  }
);
 
const API_URL = 'http://localhost:8000/api/tasks'; 
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

const initialState = {
  completedTasks: [],
  incompletedTasks: [],
  totalTasks: 0,
  completedPercentage: 0,
  incompletedPercentage: 0,
  performanceStatus: '',
  status: 'idle', 
  error: null,
};

const userPerformanceSlice = createSlice({
  name: 'userPerformance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      
      // === had part hadi ateaytola gha f profile kolchi kithsb automaticcally ===
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const tasks = action.payload;

        // Calculate total tasks
        state.totalTasks = tasks.length;

        // Categorize tasks based on status
        state.completedTasks = tasks.filter(task => task.status === 'completed');
        state.incompletedTasks = tasks.filter(task => task.status !== 'completed');

        // Calculate percentages
        state.completedPercentage = state.totalTasks
          ? (state.completedTasks.length / state.totalTasks) * 100
          : 0;
        state.incompletedPercentage = state.totalTasks
          ? (state.incompletedTasks.length / state.totalTasks) * 100
          : 0;

        // Set performance status
        state.performanceStatus = state.completedPercentage >= 80 ? 'Excellent' : 
                                 state.completedPercentage >= 50 ? 'Good' : 
                                 'Needs Improvement';
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default userPerformanceSlice.reducer;

