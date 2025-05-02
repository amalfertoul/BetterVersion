import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/mini-game-users'; 

// Async thunks for CRUD operations
export const fetchMiniGameUsers = createAsyncThunk(
    'gameUser/fetchMiniGameUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createMiniGameUser = createAsyncThunk(
    'gameUser/createMiniGameUser',
    async (newUser, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, newUser);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateMiniGameUser = createAsyncThunk(
    'gameUser/updateMiniGameUser',
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, updatedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteMiniGameUser = createAsyncThunk(
    'gameUser/deleteMiniGameUser',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
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
            // Fetch all users
            // === kattlae ghir n admin , biha angroupiw kolla game id ancountiw chhal mn mn mara ktteawd matalan ttl3b 
            // == khsna nkhadmo l cound diala chhal mn mara matalan bach ytlae lhsan n si l admin ===
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
            // Create a new user
            // === katdiclancha une fois l user kitki ela div dial lgame soi button soi tswira ilakh ===
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
            // Update a user
            // === hadi anstakhdmohachi ===
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
            // Delete a user
            // === hta hadi anstakhdmohachi ==
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