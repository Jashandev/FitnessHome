import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const Host = import.meta.env.VITE_BACKEND_URL;

// Async thunk to assign trainer to user
export const assignTrainer = createAsyncThunk('trainer/assign', async ({ userId, trainerId }, thunkAPI) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.put(
      `${Host}/api/assign-trainer`,
      { userId, trainerId },
      {
        headers: { token },
      }
    );
    return response.data; // Return success message or relevant data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to assign trainer');
  }
});

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, thunkAPI) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.get(`${Host}/api/getUsersByType?userType=4`, {
      headers: { token },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch users');
  }
});

// Async thunk to fetch trainers (userType 3)
export const fetchTrainers = createAsyncThunk('trainers/fetchAll', async (_, thunkAPI) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.get(`${Host}/api/getUsersByType?userType=3`, {
      headers: { token },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch trainers');
  }
});

const assignTrainerSlice = createSlice({
  name: 'assignTrainer',
  initialState: {
    users: [],
    trainers: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Fetch trainers
    builder
      .addCase(fetchTrainers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trainers = action.payload;
      })
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Assign trainer
    builder
      .addCase(assignTrainer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(assignTrainer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Handle assigned trainer success response
      })
      .addCase(assignTrainer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default assignTrainerSlice.reducer;
