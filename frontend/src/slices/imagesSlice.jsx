import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/images';

// Helper function to get the token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
    };
};

// Async thunks for CRUD operations
export const fetchImages = createAsyncThunk('images/fetchImages', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            return rejectWithValue('Unauthorized: Please log in.');
        }
        return rejectWithValue(error.response?.data || 'Failed to fetch images.');
    }
});

export const createImage = createAsyncThunk('images/createImage', async (imageData, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, imageData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            return rejectWithValue('Unauthorized: Please log in.');
        }
        return rejectWithValue(error.response?.data || 'Failed to create image.');
    }
});

export const fetchImageById = createAsyncThunk('images/fetchImageById', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            return rejectWithValue('Unauthorized: Please log in.');
        }
        return rejectWithValue(error.response?.data || 'Failed to fetch image.');
    }
});

export const updateImage = createAsyncThunk('images/updateImage', async ({ id, imageData }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/${id}?_method=PUT`, imageData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            return rejectWithValue('Unauthorized: Please log in.');
        }
        return rejectWithValue(error.response?.data || 'Failed to update image.');
    }
});

//=== hnaya kfch anzido image f vision board ===
export const addImageToVisionBoard = createAsyncThunk(
    'images/addImageToVisionBoard',
    async ({ id, vision_board_id }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/${id}/add-to-vision-board`,
                { vision_board_id },
                { headers: getAuthHeaders() }
            );
            return response.data.image; // assuming your backend returns { image: ... }
        } catch (error) {
            if (error.response?.status === 401) {
                return rejectWithValue('Unauthorized: Please log in.');
            }
            return rejectWithValue(error.response?.data || 'Failed to add image to vision board.');
        }
    }
);

export const deleteImage = createAsyncThunk('images/deleteImage', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: getAuthHeaders(),
        });
        return id;
    } catch (error) {
        if (error.response?.status === 401) {
            return rejectWithValue('Unauthorized: Please log in.');
        }
        return rejectWithValue(error.response?.data || 'Failed to delete image.');
    }
});

// Initial state
const initialState = {
    images: [],
    image: null,
    status: 'idle',
    error: null,
};

// Slice
const imagesSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all images
            .addCase(fetchImages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchImages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.images = action.payload;
            })
            .addCase(fetchImages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Create image
            .addCase(createImage.fulfilled, (state, action) => {
                state.images.push(action.payload);
            })
            .addCase(createImage.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Fetch image by ID
            .addCase(fetchImageById.fulfilled, (state, action) => {
                state.image = action.payload;
            })
            .addCase(fetchImageById.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Update image
            .addCase(updateImage.fulfilled, (state, action) => {
                const index = state.images.findIndex((img) => img.id === action.payload.id);
                if (index !== -1) {
                    state.images[index] = action.payload;
                }
            })
            .addCase(updateImage.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Add image to vision board
            .addCase(addImageToVisionBoard.fulfilled, (state, action) => {
                const index = state.images.findIndex((img) => img.id === action.payload.id);
                if (index !== -1) {
                    state.images[index] = action.payload;
                }
            })
            .addCase(addImageToVisionBoard.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Delete image
            .addCase(deleteImage.fulfilled, (state, action) => {
                state.images = state.images.filter((img) => img.id !== action.payload);
            })
            .addCase(deleteImage.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default imagesSlice.reducer;