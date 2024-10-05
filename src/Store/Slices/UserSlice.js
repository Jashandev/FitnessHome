import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const Host = import.meta.env.VITE_BACKEND_URL;

// Async thunk to fetch users of userType 4
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, thunkAPI) => {
  try {
    const customConfig = {
      headers: { token: Cookies.get('token'), 'Content-Type': 'application/json' },
    };
    const response = await axios.get(`${Host}/api/getUsersByType?userType=4`, customConfig);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch users');
  }
});

// Async thunk to add a user of userType 4
export const addUser = createAsyncThunk('users/addUser', async (userData, thunkAPI) => {
  try {
    const customConfig = {
      headers: { token: Cookies.get('token'), 'Content-Type': 'application/json' },
    };
    const response = await axios.post(`${Host}/api/addUser`, { ...userData, userType: 4 }, customConfig);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to add user');
  }
});

// Async thunk to update a user
export const updateUser = createAsyncThunk('users/updateUser', async ({ id, userData }, thunkAPI) => {
  try {
    const customConfig = {
      headers: { token: Cookies.get('token'), 'Content-Type': 'application/json' },
    };
    const response = await axios.put(`${Host}/api/updateUser/${id}`, userData, customConfig);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to update user');
  }
});

// Async thunk to delete a user
export const deleteUser = createAsyncThunk('users/deleteUser', async (id, thunkAPI) => {
  try {
    const customConfig = {
      headers: { token: Cookies.get('token'), 'Content-Type': 'application/json' },
    };
    const response = await axios.delete(`${Host}/api/removeUser/${id}`, customConfig);
    return { id };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to delete user');
  }
});

// Async thunk to change user password
export const changePassword = createAsyncThunk('users/changePassword', async ({ id, passwordData }, thunkAPI) => {
  try {
    const customConfig = {
      headers: { token: Cookies.get('token'), 'Content-Type': 'application/json' },
    };
    const response = await axios.put(`${Host}/api/users/${id}/change-password`, passwordData, customConfig);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to change password');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
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
      })
      // Add user
      .addCase(addUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.users.findIndex((user) => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.filter((user) => user._id !== action.payload.id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Optionally handle password change here
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
