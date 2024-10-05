const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const planSchema = new Schema({
    planName: { type: String, required: true ,  unique: true },
    planPrice: { type: Number, required: true },
    planDuration: { type: Number, required: true }, // in months
    planDescription: { type: String, required: true },
  }, { timestamps: true });
  
const  Plan = mongoose.model('Plan', planSchema);
module.exports = Plan;

  