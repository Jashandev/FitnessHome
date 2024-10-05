import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const Host = import.meta.env.VITE_BACKEND_URL;

const initialState = {
  attendance: [],
  status: 'idle',
  error: null,
  marked: false, // To track if attendance is marked
};

// Fetch attendance history
export const fetchAttendance = createAsyncThunk('attendance/fetchAttendance', async (id) => {
  const customConfig = {
    headers: { token: Cookies.get('token') },
  };
  const response = await axios.get(`${Host}/api/attendance/${id}`, customConfig);
  return response.data;
});

// Mark attendance
export const markAttendance = createAsyncThunk('attendance/markAttendance', async ({ userId, status }) => {
  const customConfig = {
    headers: { token: Cookies.get('token'), 'Content-Type': 'application/json' },
  };
  const response = await axios.post(`${Host}/api/attendance`, { userId, status }, customConfig);
  return response.data;
});

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.attendance = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.marked = true; // Mark attendance as successful
        state.attendance.push(action.payload); // Add the newly marked attendance
      });
  },
});

export default attendanceSlice.reducer;
