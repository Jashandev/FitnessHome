import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Backend URL from environment variables
const Host = import.meta.env.VITE_BACKEND_URL;

// Async thunk to generate an invoice
export const generateInvoice = createAsyncThunk(
  'invoice/generate',
  async (invoiceData, thunkAPI) => {
    try {
      const response = await axios.post(`${Host}/api/createinvoice`, invoiceData, {
        headers: {
          'Content-Type': 'application/json',
          'token': Cookies.get('token'),  // Send token in Authorization header
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to generate invoice');
    }
  }
);

const generateInvoiceSlice = createSlice({
  name: 'invoice',
  initialState: {
    invoice: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateInvoice.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(generateInvoice.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.invoice = action.payload;  // Store the generated invoice
      })
      .addCase(generateInvoice.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;  // Store the error message if failed
      });
  },
});

export default generateInvoiceSlice.reducer;
