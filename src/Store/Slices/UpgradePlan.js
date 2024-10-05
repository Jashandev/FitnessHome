import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Use the same backend URL as in assignPlan slice
const Host = import.meta.env.VITE_BACKEND_URL;

// Fetch the last invoice for a user by user ID
export const fetchLastInvoiceByUserId = createAsyncThunk(
  'plan/fetchLastInvoice',
  async (userId, thunkAPI) => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${Host}/api/getinvoicesbyid/${userId}`, {
        headers: { token },
      });
      // Assuming the API returns an array of invoices, the most recent one will be the last in the array
      const lastInvoice = response.data;
      return lastInvoice;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch last invoice');
    }
  }
);


// Async thunk to upgrade the plan for a user
export const upgradePlan = createAsyncThunk(
  'plan/upgrade',
  async ({ userId, planId, discount }, thunkAPI) => {
    try {
      const token = Cookies.get('token');
      const response = await axios.post(
        `${Host}/api/Userplan/assign`, // API is the same as the assign plan
        { userId, planId, discount },
        {
          headers: { token },
        }
      );
      return response.data; // Return the upgraded plan and invoice data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to upgrade plan');
    }
  }
);

// Reuse fetchUsersByEmail and fetchPlans from assignPlan
export const fetchUsersByEmail = createAsyncThunk(
  'users/fetchByEmail',
  async (email, thunkAPI) => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${Host}/api/users/search/${email}`, {
        headers: { token },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch users');
    }
  }
);

export const fetchPlans = createAsyncThunk(
  'plans/fetchAll',
  async (_, thunkAPI) => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${Host}/api/getallplan`, {
        headers: { token },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch plans');
    }
  }
);


const upgradePlanSlice = createSlice({
  name: 'upgradePlan',
  initialState: {
    users: [],
    plans: [],
    status: 'idle',
    error: null,
    upgradedPlan: null,
    daysLeft: 0, // Store days left in the plan
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

    builder
      .addCase(fetchLastInvoiceByUserId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLastInvoiceByUserId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastInvoice = action.payload; // Save the last invoice to the state
      })
      .addCase(fetchLastInvoiceByUserId.rejected, (state, action) => {
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

    // Upgrade plan for user
    builder
      .addCase(upgradePlan.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(upgradePlan.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.upgradedPlan = action.payload;
      })
      .addCase(upgradePlan.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default upgradePlanSlice.reducer;
