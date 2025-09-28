// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'farmer', 'customer'],
    default: 'customer'
  },
  // Farmer-specific fields
  farmName: { type: String },
  address: { type: String },
  phone: { type: String },
  approved: { type: Boolean, default: false }, // admin approves farmers
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);