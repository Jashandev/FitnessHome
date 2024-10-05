const express = require('express');
const Invoice = require('../Models/Invoice'); // Import the Invoice model
const User = require('../Models/User'); // Import the Invoice model
const router = express.Router();

// Fetch invoice by ID
    const getinvoicesbyid = async (req, res) => {

  try {
    const invoice = await Invoice.findById(req.params.id).populate('user plan');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Fetch all invoices
    const getallinvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('user plan');
    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Fetch invoices by user ID
    const invoicesbyuser = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.params.userId }).populate('plan');
    if (!invoices || invoices.length === 0) {
      return res.status(404).json({ message: 'No invoices found for this user' });
    }
    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Generate new invoice
const createInvoice = async (req, res) => {
  try {
    const { userId, planId, amount, discount, finalAmount, dueDate, status, description } = req.body;

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the invoice
    const newInvoice = new Invoice({
      user: user._id,
      plan:  null, // Include plan if provided, otherwise set null
      amount,
      discount,
      finalAmount,
      dueDate,
      status,
      description,
    });

    // Save the invoice
    const savedInvoice = await newInvoice.save();

    // Return success response
    res.status(201).json({ message: 'Invoice created successfully', invoice: savedInvoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {  getinvoicesbyid, getallinvoices, invoicesbyuser, createInvoice };

