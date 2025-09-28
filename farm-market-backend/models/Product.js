// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  category: String,
  price: { type: Number, required: true },
  currency: { type: String, default: 'NGN' },
  quantity: { type: Number, default: 0 },
  images: [String], // store file paths like /uploads/xxx.jpg
  verified: { type: Boolean, default: false }, // admin verifies listed products
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);