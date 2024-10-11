// financeSlice.js
var Host = import.meta.env.VITE_BACKEND_URL;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Async thunk for fetching debit entries with error handling
export const fetchDebitEntries = createAsyncThunk(
  'finance/fetchDebitEntries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${Host}/api/getallexpense` , {
        headers: {
            token: Cookies.get('token'), // Pass token in Authorization header
          },
      });
      return response.data; // Return the data on success
    } catch (error) {
      // If error, reject the promise with the error message
      return rejectWithValue(error.response ? error.response.data : error.msg);
    }
  }
);

// Async thunk for fetching credit entries with error handling
export const fetchCreditEntries = createAsyncThunk(
  'finance/fetchCreditEntries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${Host}/api/getallinvoices` , {
        headers: {
            token: Cookies.get('token'), // Pass token in Authorization header
          },
      });
      return response.data; // Return the data on success
    } catch (error) {
      // If error, reject the promise with the error message
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    debitEntries: [],
    creditEntries: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchDebitEntries
    builder
      .addCase(fetchDebitEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDebitEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.debitEntries = action.payload; // Set the fetched debit entries
      })
      .addCase(fetchDebitEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch debit entries';
      });

    // Handle fetchCreditEntries
    builder
      .addCase(fetchCreditEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreditEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.creditEntries = action.payload; // Set the fetched credit entries
      })
      .addCase(fetchCreditEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch credit entries';
      });
  },
});

export default financeSlice.reducer;
