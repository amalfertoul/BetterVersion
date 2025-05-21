import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api/messages';

// Helper function to get the token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
    };
};

// Fetch all messages sorted by timestamp
export const fetchMessages = createAsyncThunk(
    'messages/fetchMessages',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_BASE_URL, {
                headers: getAuthHeaders(),
            });
            return response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Send a new message
export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async (messageData, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_BASE_URL, messageData, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Delete a message
export const deleteMessage = createAsyncThunk(
    'messages/deleteMessage',
    async (messageId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE_URL}/${messageId}`, {
                headers: getAuthHeaders(),
            });
            return messageId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const messagesSlice = createSlice({
    name: 'messages',
    initialState: {
        messages: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload);
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.messages = state.messages.filter((msg) => msg.id !== action.payload);
            });
    },
});

export default messagesSlice.reducer;