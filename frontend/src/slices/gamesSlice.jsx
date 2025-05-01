import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL de l'API
const API_URL = 'http://localhost:8000/api';

// Thunk pour récupérer les jeux
export const fetchGames = createAsyncThunk('games/fetchGames', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/mini-games`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Erreur lors de la récupération des jeux');
  }
});

// Thunk pour incrémenter le compteur de jeux joués
export const incrementPlayCount = createAsyncThunk('games/incrementPlayCount', async (gameId, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/mini-games/${gameId}/play`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Erreur lors de l\'incrémentation du compteur');
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
      // Gestion de fetchGames
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
      // Gestion de incrementPlayCount
      .addCase(incrementPlayCount.fulfilled, (state, action) => {
        const updatedGame = action.payload;
        const index = state.games.findIndex((game) => game.id === updatedGame.id);
        if (index !== -1) {
          state.games[index] = updatedGame;
        }
      })
      .addCase(incrementPlayCount.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default gamesSlice.reducer;