import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Backend URL from environment variables
const Host = import.meta.env.VITE_BACKEND_URL;

// Async thunk to fetch all invoices
export const fetchAllInvoices = createAsyncThunk(
  'invoices/fetchAll',
  async (_, thunkAPI) => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${Host}/api/getallinvoices`, {
        headers: { token },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch invoices');
    }
  }
);

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState: {
    invoices: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllInvoices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllInvoices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.invoices = action.payload;
      })
      .addCase(fetchAllInvoices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default invoicesSlice.reducer;
