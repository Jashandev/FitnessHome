import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const Host = import.meta.env.VITE_BACKEND_URL;

const initialState = {
  plans: [],
  status: 'idle',
  error: null,
};

// Fetch all plans
export const fetchAllPlans = createAsyncThunk('plans/fetchAllPlans', async () => {
  const customConfig = {
    headers: { token: `${Cookies.get('token')}` },
  };
  const response = await axios.get(`${Host}/api/getallplan`, customConfig);
  return response.data;
});

// Add new plan
export const addPlan = createAsyncThunk('plans/addPlan', async (planData) => {
  const customConfig = {
    headers: { token: `${Cookies.get('token')}`, 'Content-Type': 'application/json' },
  };
  const response = await axios.post(`${Host}/api/plan`, planData, customConfig);
  return response.data;
});

// Update plan
export const updatePlan = createAsyncThunk('plans/updatePlan', async ({ id, updatedPlan }) => {
  const customConfig = {
    headers: { token: `${Cookies.get('token')}`, 'Content-Type': 'application/json' },
  };
  const response = await axios.put(`${Host}/api/plan/${id}`, updatedPlan, customConfig);
  return response.data;
});

// Remove a plan
export const removePlan = createAsyncThunk('plans/removePlan', async (id) => {
  const customConfig = {
    headers: { token: `${Cookies.get('token')}` },
  };
  const response = await axios.delete(`${Host}/api/plan/${id}`, customConfig);
  return { id };
});

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPlans.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllPlans.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.plans = action.payload;
      })
      .addCase(fetchAllPlans.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addPlan.fulfilled, (state, action) => {
        state.plans.push(action.payload);
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        const index = state.plans.findIndex((plan) => plan._id === action.payload._id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
      })
      .addCase(removePlan.fulfilled, (state, action) => {
        state.plans = state.plans.filter((plan) => plan._id !== action.payload.id);
      });
  },
});

export default plansSlice.reducer;
