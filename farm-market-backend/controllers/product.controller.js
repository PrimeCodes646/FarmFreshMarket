// controllers/product.controller.js
const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Farmer: create product (images handled by multer)
exports.createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  try {
    // Only farmers can create; check if approved
    if (req.user.role !== 'farmer') return res.status(403).json({ message: 'Only farmers can create products' });
    if (!req.user.approved) return res.status(403).json({ message: 'Farmer not approved yet' });

    const { title, description, price, quantity, category } = req.body;
    const images = (req.files || []).map(f => `/uploads/${f.filename}`);

    const product = new Product({
      farmer: req.user._id,
      title, description, price, quantity, category, images
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// Farmer: update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Only owner farmer or admin can update
    if (req.user.role !== 'admin' && product.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update' });
    }

    // If new images uploaded, append
    if (req.files && req.files.length) {
      const newImages = req.files.map(f => `/uploads/${f.filename}`);
      product.images = product.images.concat(newImages);
    }

    // update allowed fields
    const allowed = ['title','description','price','quantity','category','verified'];
    allowed.forEach(field => { if (req.body[field] !== undefined) product[field] = req.body[field]; });

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Farmer/admin: delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.user.role !== 'admin' && product.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete' });
    }

    // optionally remove images from disk
    product.images.forEach(imgPath => {
      const p = path.join(__dirname, '..', imgPath);
      fs.unlink(p, (err) => { /* ignore errors */ });
    });

    await product.remove();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// Public: list products with filters, pagination
exports.listProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, q } = req.query;
    const filters = { verified: true }; // only verified products shown publicly
    if (category) filters.category = category;
    if (q) filters.title = { $regex: q, $options: 'i' };

    const products = await Product.find(filters)
      .skip((page-1)*limit)
      .limit(parseInt(limit))
      .populate('farmer', 'name farmName');

    const total = await Product.countDocuments(filters);
    res.json({ products, total, page: parseInt(page), pages: Math.ceil(total/limit) });
  } catch (err) {
    res.status(500).json({ message: 'Error listing products' });
  }
};

// Public: get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmer', 'name farmName phone address');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};