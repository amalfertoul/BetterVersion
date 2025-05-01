import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/categories'; 

// Async thunks for CRUD operations
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const createCategory = createAsyncThunk('categories/createCategory', async (category) => {
    const response = await axios.post(API_URL, category);
    return response.data;
});

export const fetchCategory = createAsyncThunk('categories/fetchCategory', async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
});

export const updateCategory = createAsyncThunk('categories/updateCategory', async ({ id, category }) => {
    const response = await axios.put(`${API_URL}/${id}`, category);
    return response.data;
});

export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});

// Slice
const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        category: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all categories
            // === hadi khas neaytola f select input atbqa ttlae fach kanjiw npubliyiw chi tswira
            // aytleo gae categories ka ism w li ansilictioniwha andiw id diala w kistjl f column 
            // category id dial image sahla yako ===
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create a category
            // == hadi gha admin li yqdar yzid chi category jdida wla ymsha wla ymodifyiha ===
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Fetch a single category
            .addCase(fetchCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.category = action.payload;
            })
            .addCase(fetchCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update a category
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex((cat) => cat.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete a category
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter((cat) => cat.id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default categorySlice.reducer;