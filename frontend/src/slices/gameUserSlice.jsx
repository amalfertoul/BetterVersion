import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/mini-game-users';

// Helper function to get the token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
    };
};

// Async thunks for CRUD operations

// Fetch all mini-game users
export const fetchMiniGameUsers = createAsyncThunk(
    'gameUser/fetchMiniGameUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch mini-game users');
        }
    }
);

// Create a new mini-game user
export const createMiniGameUser = createAsyncThunk(
    'gameUser/createMiniGameUser',
    async (newUser, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, newUser, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create mini-game user');
        }
    }
);

// Update a mini-game user
export const updateMiniGameUser = createAsyncThunk(
    'gameUser/updateMiniGameUser',
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, updatedData, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update mini-game user');
        }
    }
);

// Delete a mini-game user
export const deleteMiniGameUser = createAsyncThunk(
    'gameUser/deleteMiniGameUser',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: getAuthHeaders(),
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete mini-game user');
        }
    }
);

// Slice
const gameUserSlice = createSlice({
    name: 'gameUser',
    initialState: {
        miniGameUsers: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all mini-game users
            .addCase(fetchMiniGameUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMiniGameUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.miniGameUsers = action.payload;
            })
            .addCase(fetchMiniGameUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create a new mini-game user
            .addCase(createMiniGameUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMiniGameUser.fulfilled, (state, action) => {
                state.loading = false;
                state.miniGameUsers.push(action.payload);
            })
            .addCase(createMiniGameUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update a mini-game user
            .addCase(updateMiniGameUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMiniGameUser.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.miniGameUsers.findIndex(
                    (user) => user.id === action.payload.id
                );
                if (index !== -1) {
                    state.miniGameUsers[index] = action.payload;
                }
            })
            .addCase(updateMiniGameUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete a mini-game user
            .addCase(deleteMiniGameUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMiniGameUser.fulfilled, (state, action) => {
                state.loading = false;
                state.miniGameUsers = state.miniGameUsers.filter(
                    (user) => user.id !== action.payload
                );
            })
            .addCase(deleteMiniGameUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default gameUserSlice.reducer;