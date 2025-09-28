// routes/products.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const productCtrl = require('../controllers/product.controller');
const { productValidation } = require('../utils/validators');

const multer = require('multer');
const path = require('path');

// multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1E9)}${ext}`);
  }
});
const upload = multer({ storage });

// Public
router.get('/', productCtrl.listProducts);
router.get('/:id', productCtrl.getProduct);

// Farmer creates product (with images)
router.post('/', auth, requireRole('farmer'), upload.array('images', 6), productValidation, productCtrl.createProduct);

// Update/delete (farmer owner or admin)
router.put('/:id', auth, upload.array('images', 6), productCtrl.updateProduct);
router.delete('/:id', auth, productCtrl.deleteProduct);

module.exports = router;