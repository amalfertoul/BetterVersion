import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/vision-boards';

// Async thunks for CRUD operations
export const fetchVisionBoards = createAsyncThunk('visionBoard/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const createVisionBoard = createAsyncThunk('visionBoard/create', async (visionBoardData, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, visionBoardData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const fetchVisionBoardById = createAsyncThunk('visionBoard/fetchById', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateVisionBoard = createAsyncThunk('visionBoard/update', async ({ id, visionBoardData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, visionBoardData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteVisionBoard = createAsyncThunk('visionBoard/delete', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

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
            //=== hadi anhtajoha aneaytola f profile ms , ghanfiltriw eliha bach ytleolna ghir dial l user dialna ===
            // === machi gae li f database rak fahm ===
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
            // === hadi aneaytola f profile f chi partie li ncriyiw fiha vision board ===
            // === n9deo nemloha hta f explore ida kona creative f design w hta f lcode nemlohom kitleo f chi section ===
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
            // === idk nqdro nhtajoha somehow gha khaliwha hnaya hhhh ===
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
            // === hadi kanupdatiw biha dkchi eadi fhal l2ism etc ms ida bghiti thayd mna chi image ===
            // == khsk hta tdkhol n image w temla hia update n id d vision board trodo null ===
            // === hit asln tn fach katcliki ela vision board mn bara khas ytaffichawlk les images li fiha ===
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
            });
    },
});

// Export actions and reducer
export const { clearError } = visionBoardSlice.actions;
export default visionBoardSlice.reducer;