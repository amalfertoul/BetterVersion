import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL of the API
const API_URL = 'http://localhost:8000/api/mini-games';

// Helper function to get the token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
    };
};

// Thunks for CRUD operations and incrementing play count

// Fetch all games
export const fetchGames = createAsyncThunk('games/fetchGames', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Error fetching games');
    }
});

// Create a new game
export const createGame = createAsyncThunk('games/createGame', async (gameData, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        Object.keys(gameData).forEach((key) => formData.append(key, gameData[key]));
        const response = await axios.post(API_URL, formData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Error creating game');
    }
});

// Update an existing game
export const updateGame = createAsyncThunk('games/updateGame', async ({ gameId, gameData }, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        Object.keys(gameData).forEach((key) => formData.append(key, gameData[key]));
        const response = await axios.post(`${API_URL}/${gameId}?_method=PUT`, formData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Error updating game');
    }
});

// Delete a game
export const deleteGame = createAsyncThunk('games/deleteGame', async (gameId, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${gameId}`, {
            headers: getAuthHeaders(),
        });
        return gameId;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Error deleting game');
    }
});

// Initial state
const initialState = {
    games: [],
    loading: false,
    error: null,
};

// Slice
const gamesSlice = createSlice({
    name: 'games',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch games
            .addCase(fetchGames.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGames.fulfilled, (state, action) => {
                state.loading = false;
                state.games = action.payload;
            })
            .addCase(fetchGames.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create game
            .addCase(createGame.fulfilled, (state, action) => {
                state.games.push(action.payload);
            })
            .addCase(createGame.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Update game
            .addCase(updateGame.fulfilled, (state, action) => {
                const updatedGame = action.payload;
                const index = state.games.findIndex((game) => game.id === updatedGame.id);
                if (index !== -1) {
                    state.games[index] = updatedGame;
                }
            })
            .addCase(updateGame.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Delete game
            .addCase(deleteGame.fulfilled, (state, action) => {
                state.games = state.games.filter((game) => game.id !== action.payload);
            })
            .addCase(deleteGame.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default gamesSlice.reducer;