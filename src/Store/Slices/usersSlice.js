// src/redux/slices/userSlice.js
var Host = import.meta.env.VITE_BACKEND_URL;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axios from 'axios';

// Create async thunk for fetching users by filter
export const fetchUsersByFilter = createAsyncThunk(
  'users/fetchUsersByFilter',
  async ({ filterType }, thunkAPI) => {
    try {
      const urlMap = {
        inactive: '/api/inactive-users',
        expiringPlans: '/api/expiring-plans',
        paymentsDue: '/api/users-payments-due',
      };

      const response = await axios.get( `${Host}${urlMap[filterType]}`, {
        headers: {
          token: Cookies.get('token'), // Send token in the Authorization header
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersByFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersByFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersByFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
