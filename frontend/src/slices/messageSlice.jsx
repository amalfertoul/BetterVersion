import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api/messages';

// Fetch all messages sorted by timestamp
// == hadi emlta bach automatiquement ytafichaw mrtbin ela hsab date mayhtajchi hnaya neawtohom b ydna f interface ===
export const fetchMessages = createAsyncThunk(
    'messages/fetchMessages',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get('http://localhost:8000/api/messages');
        console.log('API Response:', response.data); // Inspectez la structure ici
        if (!Array.isArray(response.data)) {
          throw new Error('La réponse de l\'API n\'est pas un tableau');
        }
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
      messages: [], // Assurez-vous que l'état initial est un tableau vide
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
          console.log('Payload:', action.payload); // Vérifiez si les données sont reçues
          state.status = 'succeeded';
          state.messages = Array.isArray(action.payload) ? action.payload : []; // Vérifiez que c'est un tableau
        })
        .addCase(fetchMessages.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
        builder
        .addCase(sendMessage.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(sendMessage.fulfilled, (state, action) => {
          state.status = 'succeeded';
        
          const newMessage = {
            ...action.payload,
            timestamp: action.payload.timestamp
              ? new Date(action.payload.timestamp).toISOString()
              : new Date().toISOString(), // fallback to client timestamp if none
          };
        
          // Optional: prevent adding duplicate messages by ID (if ID exists)
          const exists = state.messages.some(msg => msg.id === newMessage.id);
          if (!exists) {
            state.messages.push(newMessage);
          }
        })
        .addCase(sendMessage.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload || action.error.message;
        })
        
          .addCase(deleteMessage.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(deleteMessage.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.messages = state.messages.filter(
              (message) => message.id !== action.payload
            ); // Remove the deleted message from the state
        });
    }
  });

export default messagesSlice.reducer;