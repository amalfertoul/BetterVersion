import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API base URL
const API_BASE_URL = '/api/messages';

// Fetch all messages sorted by timestamp
// == hadi emlta bach automatiquement ytafichaw mrtbin ela hsab date mayhtajchi hnaya neawtohom b ydna f interface ===
export const fetchMessages = createAsyncThunk(
    'messages/fetchMessages',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}`);
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
            const response = await axios.post(`${API_BASE_URL}`, messageData);
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
            await axios.delete(`${API_BASE_URL}/${messageId}`);
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
            // Fetch messages
            // == hnaya khsna nemlo filter b userId as a receiver w aytleolna gae msjs dialo mea gae senders ===
            // == dksaea f kola conversation khsna nfiltriw ela hsab kola friend [sender] netiwlo convo d msjt dialo bohdo ===
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
            // Send message
            // == kaneaytola mn mor makiktb chi message w ytki f sent dksaea kattlae f convo automatiquement 
            // == hit kankono deja mfetchyin f convo ===
            // == mhm mli tkono khadamin ela interface t2akdo ==
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Delete message
            // == emlo chihaja li nqdro nmsho biha msj fost convo w sf ==
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.messages = state.messages.filter((message) => message.id !== action.payload);
            })
            .addCase(deleteMessage.rejected, (state, action) => {
                state.error = action.payload;
            });

            // == b nsba n msjt li kimsho mn mora 24 hour wla ay modda bghinaha 
            // khsna ncriyiw wahd commande f backend php artisan make:command DeleteOldMessages dksaea nstakhdmoh
            // bon ftcho eliha hia w qdia d notifications mea msjt ===
    },
});

export default messagesSlice.reducer;