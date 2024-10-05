import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const Host = import.meta.env.VITE_BACKEND_URL;

const initialState = {
  managers: [],
  status: 'idle',
  error: null,
};

// Fetch all managers
export const fetchAllManagers = createAsyncThunk('managers/fetchAllManagers', async () => {
  const customConfig = {
    headers: { token: Cookies.get('token') },
  };
  const response = await axios.get(`${Host}/api/getUsersByType?userType=2`, customConfig); // Assuming managers are userType 2
  return response.data;
});

// Add new manager
export const addManager = createAsyncThunk('managers/addManager', async (newManager, thunkAPI) => {
  try {
    const customConfig = {
      headers: { token: Cookies.get('token'), 'Content-Type': 'application/json' },
    };
    const response = await axios.post(`${Host}/api/addUser`, { ...newManager, userType: 2 }, customConfig); // Add userType: 2 for managers
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to add manager');
  }
});

// Update manager
export const updateManager = createAsyncThunk('managers/updateManager', async ({ id, updatedManager }) => {
  const customConfig = {
    headers: { token: Cookies.get('token'), 'Content-Type': 'application/json' },
  };
  const response = await axios.put(`${Host}/api/updateUser/${id}`, updatedManager, customConfig); // Update user details
  return response.data;
});

// Remove manager
export const removeManager = createAsyncThunk('managers/removeManager', async (id, thunkAPI) => {
  try {
    const customConfig = {
      headers: { token: Cookies.get('token') },
    };
    await axios.delete(`${Host}/api/removeUser/${id}`, customConfig); // Remove user by ID
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to remove manager');
  }
});

const managersSlice = createSlice({
  name: 'managers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all managers
      .addCase(fetchAllManagers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllManagers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.managers = action.payload;
      })
      .addCase(fetchAllManagers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add manager
      .addCase(addManager.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addManager.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.managers.push(action.payload);
      })
      .addCase(addManager.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update manager
      .addCase(updateManager.fulfilled, (state, action) => {
        const index = state.managers.findIndex((manager) => manager._id === action.payload._id);
        if (index !== -1) {
          state.managers[index] = action.payload;
        }
      })
      // Remove manager
      .addCase(removeManager.fulfilled, (state, action) => {
        state.managers = state.managers.filter((manager) => manager._id !== action.payload); // Remove manager from the state
      })
      .addCase(removeManager.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default managersSlice.reducer;
