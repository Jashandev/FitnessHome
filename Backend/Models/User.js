const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  userType: { type: Number, enum: [1, 2, 3, 4], required: true }, // 1: admin, 2: manager, 3: trainer, 4: user
  dob: { type: Date },
  fatherName: { type: String },
  address: { type: String },
  city: { type: String },
  trainer: { type: Schema.Types.ObjectId, ref: 'User' }, // Trainer ID for users
  timing: { type: String },
  bloodGroup: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true, unique: true },
  plan: { type: Schema.Types.ObjectId, ref: 'Plan' }, // Reference to plan schema
  Invoice: { type: Schema.Types.ObjectId, ref: 'Invoice' }, // Reference to plan schema
  dateOfPlanExpire: { type: Date },
  dateOfJoin: { type: Date, default: Date.now },
  dateOfLeave: { type: Date },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
