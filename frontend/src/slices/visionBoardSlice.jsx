import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/vision-boards';

// Helper function to get the token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
    };
};

// Async thunks for CRUD operations

// Fetch all vision boards
export const fetchVisionBoards = createAsyncThunk('visionBoard/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch vision boards.');
    }
});

export const createVisionBoard = createAsyncThunk('visionBoard/create', async (visionBoardData, { rejectWithValue }) => {
    try {
       const response = await axios.post(
        `http://127.0.0.1:8000/api/tasks/${taskId}/vision-boards`,
        visionBoardData,
        { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } }
      );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to create vision board.');
    }
});

export const fetchVisionBoardById = createAsyncThunk('visionBoard/fetchById', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch vision board.');
    }
});

export const updateVisionBoard = createAsyncThunk('visionBoard/update', async ({ id, visionBoardData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, visionBoardData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to update vision board.');
    }
});

export const deleteVisionBoard = createAsyncThunk('visionBoard/delete', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${id}`, {
            headers: getAuthHeaders(),
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to delete vision board.');
    }
});

// Add vision board to task
export const addVisionBoardToTask = createAsyncThunk(
    'visionBoard/addVisionBoardToTask',
    async ({ taskId, visionBoardData }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/tasks/${taskId}/vision-boards/attach`,
                visionBoardData,
                {
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add vision board to task.');
        }
    }
);

// Initial state
const initialState = {
    visionBoards: [],
    visionBoard: null,
    loading: false,
    error: null,
};

// Slice
const visionBoardSlice = createSlice({
    name: 'visionBoard',
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all vision boards
            .addCase(fetchVisionBoards.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVisionBoards.fulfilled, (state, action) => {
                state.loading = false;
                state.visionBoards = action.payload;
            })
            .addCase(fetchVisionBoards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create vision board
            .addCase(createVisionBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createVisionBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.visionBoards.push(action.payload);
            })
            .addCase(createVisionBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch vision board by ID
            .addCase(fetchVisionBoardById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVisionBoardById.fulfilled, (state, action) => {
                state.loading = false;
                state.visionBoard = action.payload;
            })
            .addCase(fetchVisionBoardById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update vision board
            .addCase(updateVisionBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVisionBoard.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.visionBoards.findIndex((board) => board.id === action.payload.id);
                if (index !== -1) {
                    state.visionBoards[index] = action.payload;
                }
            })
            .addCase(updateVisionBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete vision board
            .addCase(deleteVisionBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteVisionBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.visionBoards = state.visionBoards.filter((board) => board.id !== action.payload);
            })
            .addCase(deleteVisionBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add vision board to task
            .addCase(addVisionBoardToTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addVisionBoardToTask.fulfilled, (state, action) => {
                state.loading = false;
                state.visionBoards.push(action.payload);
            })
            .addCase(addVisionBoardToTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export const { clearError } = visionBoardSlice.actions;
export default visionBoardSlice.reducer;