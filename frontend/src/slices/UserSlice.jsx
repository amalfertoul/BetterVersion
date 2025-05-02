import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for API
const API_URL = 'http://localhost:8000/api';

// Async Thunks for CRUD operations

// Fetch all users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/users`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Register a new user
export const registerUser = createAsyncThunk('users/registerUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Login user
export const loginUser = createAsyncThunk('users/loginUser', async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || 'Login failed');
    }
});

// Logout user
export const logoutUser = createAsyncThunk('users/logoutUser', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/logout`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Fetch a single user by ID
export const fetchUserById = createAsyncThunk('users/fetchUserById', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/users/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Update a user
export const updateUser = createAsyncThunk('users/updateUser', async ({ id, userData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/users/${id}`, userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Delete a user
export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Initial state
const initialState = {
    users: [],
    user: null,
    userId: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};
// Update user profile (new function)
export const updateUserProfile = createAsyncThunk(
    'users/updateUserProfile',
    async ({ id, profileData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/users/${id}`, profileData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Slice
const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
        resetUser: (state) => {
            state.user = null;
        },
        // ajouter pour les messages
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register user
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
                state.userId = action.payload.id;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login user
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.userId = action.payload.user.id; 
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout user
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.userId = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch user by ID
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update user
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.users.findIndex((user) => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete user
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter((user) => user.id !== action.meta.arg);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export const { resetError, resetUser, setUserId } = userSlice.actions;
export default userSlice.reducer;