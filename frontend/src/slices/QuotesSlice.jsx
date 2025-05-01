import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base API URL
const API_URL = 'http://127.0.0.1:8000/api/quotes';

// Async thunks for CRUD operations

// Fetch all quotes
export const fetchQuotes = createAsyncThunk('quotes/fetchQuotes', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

// Create a new quote
export const createQuote = createAsyncThunk('quotes/createQuote', async (quoteData) => {
    const response = await axios.post(API_URL, quoteData);
    return response.data; // Return the full quote information
});

// Update an existing quote
export const updateQuote = createAsyncThunk('quotes/updateQuote', async ({ id, quoteData }) => {
    const response = await axios.put(`${API_URL}/${id}`, quoteData);
    return response.data; // Return the full updated quote information
});

// Delete a quote
export const deleteQuote = createAsyncThunk('quotes/deleteQuote', async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});

// Quotes slice
const quotesSlice = createSlice({
    name: 'quotes',
    initialState: {
        quotes: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetQuotesState: (state) => {
            state.quotes = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch quotes
            // === hadi stakhdmta bach ntalae wahda kola 24 saea 
            // === anstakhdmoha bach ytleo quotes kamlin n admin hta huaa ===
            .addCase(fetchQuotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuotes.fulfilled, (state, action) => {
                state.loading = false;
                state.quotes = action.payload;
            })
            .addCase(fetchQuotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create quote
            // == ghir admin li yqdar ycriyi ymodifyi wla ysupprimi chi quote ===
            .addCase(createQuote.fulfilled, (state, action) => {
                state.quotes.push(action.payload); // Add the full quote information
            })
            // Update quote
            .addCase(updateQuote.fulfilled, (state, action) => {
                const index = state.quotes.findIndex((quote) => quote.id === action.payload.id);
                if (index !== -1) {
                    state.quotes[index] = action.payload; // Update with the full quote information
                }
            })
            // Delete quote
            .addCase(deleteQuote.fulfilled, (state, action) => {
                state.quotes = state.quotes.filter((quote) => quote.id !== action.payload);
            });
    },
});

export const { resetQuotesState } = quotesSlice.actions;
export default quotesSlice.reducer;