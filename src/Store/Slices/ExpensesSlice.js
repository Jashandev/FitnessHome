var Host = import.meta.env.VITE_BACKEND_URL;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Async thunk to fetch all expenses
export const fetchAllExpenses = createAsyncThunk('expenses/fetchAll', async (_, thunkAPI) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.get(`${Host}/api/getallexpense`, {
      headers: { token: Cookies.get('token') },
    });
    return response.data; // Return the data to the reducer
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch expenses');
  }
});

// Async thunk to add a new expense
export const addExpense = createAsyncThunk('expenses/add', async (expenseData, thunkAPI) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.post(`${Host}/api/addexpense`, expenseData, {
      headers: { token: Cookies.get('token') },
    });
    return response.data.expense; // Return the added expense
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to add expense');
  }
});

// Create slice for expenses
const expensesSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all expenses
    builder
      .addCase(fetchAllExpenses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.expenses = action.payload;
      })
      .addCase(fetchAllExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Add a new expense
      .addCase(addExpense.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.expenses.push(action.payload); // Add the new expense to the list
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default expensesSlice.reducer;
