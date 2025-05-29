import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for API
const API_URL = 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
    };
};

// Async Thunks for CRUD operations

// Register user
export const registerUser = createAsyncThunk('users/registerUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Register error:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || 'Registration failed');
    }
});

// Login user
export const loginUser = createAsyncThunk('users/loginUser', async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        // Store token in localStorage
        const { access_token, user } = response.data;
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);


// Logout user
export const logoutUser = createAsyncThunk('users/logoutUser', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Clear token and user data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Logout failed');
    }
});

// Fetch current user details
export const fetchCurrentUser = createAsyncThunk('users/fetchCurrentUser', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch user');
    }
});

// Fetch all users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch users');
    }
});

// Delete user
export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to delete user');
    }
});

// Update user
export const updateUser = createAsyncThunk('users/updateUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/users/${userData.id}`, userData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to update user');
    }
});

// Initial state
const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    users: [],
    loading: false,
    error: null,
};

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
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        updateUserSuccess: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
            // Update localStorage
            localStorage.setItem('user', JSON.stringify(action.payload));
        }
    },
    extraReducers: (builder) => {
        builder
            // Register user
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
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
                state.token = action.payload.access_token;
                state.isAuthenticated = true;
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
                state.token = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch current user
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
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
            })
            // Update user
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                // Update localStorage
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export const { resetError, resetUser, updateUserSuccess } = userSlice.actions;
export default userSlice.reducer;