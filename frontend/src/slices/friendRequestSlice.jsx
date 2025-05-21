import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API base URL as a constant
const API_BASE_URL = 'http://localhost:8000/api/friend-requests';

// Helper function to get the token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
    };
};

// Fetch all friend requests
export const fetchFriendRequests = createAsyncThunk(
    'friendRequests/fetchFriendRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch friend requests');
        }
    }
);

// Create a new friend request
export const createFriendRequest = createAsyncThunk(
    'friendRequests/createFriendRequest',
    async (requestData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}`, requestData, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create friend request');
        }
    }
);

// Update request (e.g., accept or reject)
export const updateFriendRequest = createAsyncThunk(
    'friendRequests/updateFriendRequest',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/${id}`,
                { status },
                {
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update friend request');
        }
    }
);

// Delete request (when rejected)
export const deleteFriendRequest = createAsyncThunk(
    'friendRequests/deleteFriendRequest',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`, {
                headers: getAuthHeaders(),
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete friend request');
        }
    }
);

const friendRequestsSlice = createSlice({
    name: 'friendRequests',
    initialState: {
        pending: [],
        accepted: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        resetError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all friend requests
            .addCase(fetchFriendRequests.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchFriendRequests.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.pending = action.payload.filter((req) => req.status === 'pending');
                state.accepted = action.payload.filter((req) => req.status === 'accepted');
            })
            .addCase(fetchFriendRequests.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Create a new friend request
            .addCase(createFriendRequest.fulfilled, (state, action) => {
                if (action.payload.status === 'pending') {
                    state.pending.push(action.payload);
                }
            })
            .addCase(createFriendRequest.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Update friend request (accept/reject)
            .addCase(updateFriendRequest.fulfilled, (state, action) => {
                if (action.payload?.id && action.payload?.status) {
                    state.pending = state.pending.filter((req) => req.id !== action.payload.id);
                    if (action.payload.status === 'accepted') {
                        state.accepted.push(action.payload);
                    }
                }
            })
            .addCase(updateFriendRequest.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Delete friend request (when rejected)
            .addCase(deleteFriendRequest.fulfilled, (state, action) => {
                state.pending = state.pending.filter((req) => req.id !== action.payload);
                state.accepted = state.accepted.filter((req) => req.id !== action.payload);
            })
            .addCase(deleteFriendRequest.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export const { resetError } = friendRequestsSlice.actions;
export default friendRequestsSlice.reducer;