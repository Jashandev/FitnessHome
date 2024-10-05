const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const attendanceSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent'], required: true },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Attendance', attendanceSchema);
  