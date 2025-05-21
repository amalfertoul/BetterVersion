import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base API URL
const API_URL = 'http://127.0.0.1:8000/api/quotes';

// Helper function to get the token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
    };
};

// Async thunks for CRUD operations

// Fetch all quotes
export const fetchQuotes = createAsyncThunk('quotes/fetchQuotes', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch quotes');
    }
});

// Create a new quote
export const createQuote = createAsyncThunk('quotes/createQuote', async (quoteData, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, quoteData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to create quote');
    }
});

// Update an existing quote
export const updateQuote = createAsyncThunk('quotes/updateQuote', async ({ id, quoteData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, quoteData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to update quote');
    }
});

// Delete a quote
export const deleteQuote = createAsyncThunk('quotes/deleteQuote', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${id}`, {
            headers: getAuthHeaders(),
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to delete quote');
    }
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
                state.error = action.payload;
            })
            .addCase(createQuote.fulfilled, (state, action) => {
                state.quotes.push(action.payload);
            })
            .addCase(updateQuote.fulfilled, (state, action) => {
                const index = state.quotes.findIndex((quote) => quote.id === action.payload.id);
                if (index !== -1) {
                    state.quotes[index] = action.payload;
                }
            })
            .addCase(deleteQuote.fulfilled, (state, action) => {
                state.quotes = state.quotes.filter((quote) => quote.id !== action.payload);
            });
    },
});

export const { resetQuotesState } = quotesSlice.actions;
export default quotesSlice.reducer;