const Expense = require('../Models/Expense');

// Add a new expense
const addExpense = async (req, res) => {
  try {
    const { type, description, amount } = req.body;

    // Create a new expense record
    const newExpense = new Expense({
      type,
      description,
      amount,
      createdBy: req.user.userId // Get the userId from the token data
    });

    await newExpense.save();
    res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all expenses (optional)
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('createdBy', 'name email');
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addExpense, getAllExpenses };