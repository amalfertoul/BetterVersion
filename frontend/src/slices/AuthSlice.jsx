import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";


export const loginUser = createAsyncThunk("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    await axios.get("http://localhost:8000/sanctum/csrf-cookie"); // CSRF protection
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });

    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user info in localStorage
      localStorage.setItem("token", response.data.token);


    }

    return response.data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Login failed" });
  }
});

// Logout function
export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
    localStorage.removeItem("user"); 
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Store user in Redux
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
