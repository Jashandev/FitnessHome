const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  type: {
    type: String,
    // enum: ['daily', 'salary'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Expense = mongoose.model('Expense', ExpenseSchema);
module.exports = Expense;
