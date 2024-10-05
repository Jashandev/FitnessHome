import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const Host = import.meta.env.VITE_BACKEND_URL;

const initialState = {
  trainers: [],
  status: 'idle',
  error: null,
};

// Fetch all trainers (common API for users by userType)
export const fetchAllTrainers = createAsyncThunk('trainers/fetchAllTrainers', async (_, thunkAPI) => {
  try {
    const customConfig = {
      headers: { token: Cookies.get('token') },
    };
    const response = await axios.get(`${Host}/api/getUsersByType?userType=3`, customConfig); // Fetch trainers by userType 3
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch trainers');
  }
});

// Add a new trainer (common API for adding a user)
export const addTrainer = createAsyncThunk('trainers/addTrainer', async (newTrainer, thunkAPI) => {
  try {
    const customConfig = {
      headers: { token: Cookies.get('token'), 'Content-Type': 'application/json' },
    };
    const response = await axios.post(`${Host}/api/addUser`, { ...newTrainer, userType: 3 }, customConfig); // Add a trainer with userType 3
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to add trainer');
  }
});

// Update a trainer (common API for updating a user)
export const updateTrainer = createAsyncThunk('trainers/updateTrainer', async ({ id, updatedTrainer }, thunkAPI) => {
  try {
    const customConfig = {
      headers: { token: Cookies.get('token'), 'Content-Type': 'application/json' },
    };
    const response = await axios.put(`${Host}/api/updateUser/${id}`, updatedTrainer, customConfig); // Update trainer details
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to update trainer');
  }
});

// Remove a trainer (common API for removing a user)
export const removeTrainer = createAsyncThunk('trainers/removeTrainer', async (id, thunkAPI) => {
  try {
    const customConfig = {
      headers: { token: Cookies.get('token') },
    };
    await axios.delete(`${Host}/api/removeUser/${id}`, customConfig); // Remove trainer
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to remove trainer');
  }
});

// Assign a trainer to a user (common API)
export const assignTrainerToUser = createAsyncThunk('trainers/assignTrainerToUser', async ({ userId, trainerId }, thunkAPI) => {
  try {
    const customConfig = {
      headers: { token: Cookies.get('token'), 'Content-Type': 'application/json' },
    };
    const response = await axios.post(`${Host}/api/assignTrainer`, { userId, trainerId }, customConfig); // Assign trainer to user
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to assign trainer');
  }
});

const trainersSlice = createSlice({
  name: 'trainers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Trainers
      .addCase(fetchAllTrainers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllTrainers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trainers = action.payload;
      })
      .addCase(fetchAllTrainers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add Trainer
      .addCase(addTrainer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTrainer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trainers.push(action.payload); // Add the new trainer to the state
      })
      .addCase(addTrainer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update Trainer
      .addCase(updateTrainer.fulfilled, (state, action) => {
        const index = state.trainers.findIndex((trainer) => trainer._id === action.payload._id);
        if (index !== -1) {
          state.trainers[index] = action.payload; // Update the trainer in the state
        }
      })
      // Remove Trainer
      .addCase(removeTrainer.fulfilled, (state, action) => {
        state.trainers = state.trainers.filter((trainer) => trainer._id !== action.payload); // Remove the trainer from state
      })
      .addCase(removeTrainer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Assign Trainer to User
      .addCase(assignTrainerToUser.fulfilled, (state, action) => {
        // Handle trainer assignment logic, if needed
      })
      .addCase(assignTrainerToUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default trainersSlice.reducer;
