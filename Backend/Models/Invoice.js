const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const invoiceSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
    amount: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // Discount on the plan price
    finalAmount: { type: Number, required: true }, // After discount
    paymentDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    status: { type: String, required: true },
    description: { type: String },
  });
  
  const Invoice = mongoose.model('Invoice', invoiceSchema);

  module.exports = Invoice; // Ensure it's exported correctly
  