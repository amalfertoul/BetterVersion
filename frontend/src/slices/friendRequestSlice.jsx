import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API base URL as a constant
const API_BASE_URL = 'http://localhost:8000/api/friend-requests';

// Fetch all friend requests
export const fetchFriendRequests = createAsyncThunk(
    'friendRequests/fetchFriendRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}`);
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
            const response = await axios.post(`${API_BASE_URL}`, requestData);
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
            const response = await axios.put(`${API_BASE_URL}/${id}`, { status });
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
            await axios.delete(`${API_BASE_URL}/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete friend request');
        }
    }
);

const friendRequestsSlice = createSlice({
    name: 'friendRequests',
    initialState: {
        pending: [], // === hnaya kitstokaw les invitation li msardin ==
        accepted: [], // === hnaya kitstoraw li tacceptaw w sf rjei des amis ==
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
            // == hnaya eandk juj hajat , awl haja hada kitalae les tableau bjuj d les amis w hta d les invitations
            // bach nkhadmohom sa7 , awl haja f blasa d friend request kanfiltriw b receiver_id == userId li mconnecti ela table pending
            // f blasa d les amis kanfiltriw b receiver_id ela table acceptes
            // nqdro nzido blasa d les invitation li hnaya msardin knfiltriw b sender_id == userId ela table pendin
            // tmak nqdro ida bghina neayto n delete w nhaydo invitation li hnaya msardin easy right ? ===
            .addCase(fetchFriendRequests.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchFriendRequests.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.pending = action.payload.filter(req => req.status === 'pending');
                state.accepted = action.payload.filter(req => req.status === 'accepted');
            })
            .addCase(fetchFriendRequests.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Create a new friend request
            // === hadi katdeclancha une fois knclikiw ela send friend request eadi
            .addCase(createFriendRequest.fulfilled, (state, action) => {
                if (action.payload.status === 'pending') {
                    state.pending.push(action.payload);
                }
            })
            .addCase(createFriendRequest.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Update friend request (accept/reject)
            // == hadi une fois knbdlo status n accepted automatiquement kathayda mn pending w katroda n accepted ===
            .addCase(updateFriendRequest.fulfilled, (state, action) => {
                if (action.payload?.id && action.payload?.status) {
                    state.pending = state.pending.filter(req => req.id !== action.payload.id);
                    if (action.payload.status === 'accepted') {
                        state.accepted.push(action.payload);
                    }
                }
            })
            .addCase(updateFriendRequest.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Delete friend request (when rejected)
            // === hadi kaneaytola f button d decline eadi w sf ===
            .addCase(deleteFriendRequest.fulfilled, (state, action) => {
                state.pending = state.pending.filter(req => req.id !== action.payload);
            })
            .addCase(deleteFriendRequest.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

// === remember drr manfiltriw b userId ay aja ankhadmoha f had projet mn ghir l games w tsawar d explore i guess
// === mhm toma rodo bal w slm ===

export const { resetError } = friendRequestsSlice.actions;

export default friendRequestsSlice.reducer;