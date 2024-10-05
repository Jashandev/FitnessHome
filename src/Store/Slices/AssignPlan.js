var Host = import.meta.env.VITE_BACKEND_URL;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Async thunk to assign plan to user
export const assignPlan = createAsyncThunk('plan/assign', async ({ userId, planId, discount }, thunkAPI) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.post(
      `${Host}/api/Userplan/assign`,
      { userId, planId, discount },
      {
        headers: { token },
      }
    );
    return response.data; // Return the assigned plan and invoice data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to assign plan');
  }
});

// Async thunk to fetch users by email
export const fetchUsersByEmail = createAsyncThunk('users/fetchByEmail', async (email, thunkAPI) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.get(`${Host}/api/users/search/${email}`, {
      headers: { token },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch users');
  }
});

// Async thunk to fetch all available plans
export const fetchPlans = createAsyncThunk('plans/fetchAll', async (_, thunkAPI) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.get(`${Host}/api/getallplan`, {
      headers: { token },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch plans');
  }
});

const assignPlanSlice = createSlice({
  name: 'assignPlan',
  initialState: {
    users: [],
    plans: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch users by email
    builder
      .addCase(fetchUsersByEmail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsersByEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsersByEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Fetch available plans
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Assign plan to user
    builder
      .addCase(assignPlan.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(assignPlan.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Handle the assigned plan and invoice data
      })
      .addCase(assignPlan.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default assignPlanSlice.reducer;
