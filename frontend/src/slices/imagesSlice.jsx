import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/images'; 

// Async thunks for CRUD operations
export const fetchImages = createAsyncThunk('images/fetchImages', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const createImage = createAsyncThunk('images/createImage', async (imageData) => {
    const response = await axios.post(API_URL, imageData);
    return response.data;
});

export const fetchImageById = createAsyncThunk('images/fetchImageById', async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
});

export const updateImage = createAsyncThunk('images/updateImage', async ({ id, imageData }) => {
    const response = await axios.put(`${API_URL}/${id}`, imageData);
    return response.data;
});

export const deleteImage = createAsyncThunk('images/deleteImage', async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return id;
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
            //===== hadi anhtajoha f explore page fain aytleolkom gae images fhal pintress =====
            // === anhtajoha aussi f lvision board fach ghatcliki fih ghaytleolk gae les images {li anfiltriwhom b id d vision board}
            // don anhtajo neayto n had fetch ms nfiltriw eliha f interface ===
            .addCase(fetchImages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchImages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.images = action.payload;
            })
            .addCase(fetchImages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Create image
            // === hadi anhtajoha f page profile fain anb9aw npubliyiw images li ghaykon id d user dialom hua li msjl f userSlic===
            .addCase(createImage.fulfilled, (state, action) => {
                state.images.push(action.payload);
            })
            // Fetch image by ID
            // === hadi anhtajoha f vision board i guess hit knhtajo mhm khaliwha hnaya hhhh ===
            .addCase(fetchImageById.fulfilled, (state, action) => {
                state.image = action.payload;
            })
            // Update image
            // ==== hadi hta hia aneatola f profile bach n updatiw image li hnaya mpostyin ===
            // === b had update hadi kan9dro nbdlo l id d vision board mn null n vision board li bghina ===
            // === bach anbqaw n ajoutiw les images n vision board dialna ===
            .addCase(updateImage.fulfilled, (state, action) => {
                const index = state.images.findIndex((img) => img.id === action.payload.id);
                if (index !== -1) {
                    state.images[index] = action.payload;
                }
            })
            // Delete image
            // === f profile fach atbghi tmsah pic ===
            .addCase(deleteImage.fulfilled, (state, action) => {
                state.images = state.images.filter((img) => img.id !== action.payload);
            });
    },
});

export default imagesSlice.reducer;