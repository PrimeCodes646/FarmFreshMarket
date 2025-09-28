// routes/orders.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const orderCtrl = require('../controllers/order.controller');
const { requireRole } = require('../middleware/roles');

// Create order (customer)
router.post('/', auth, orderCtrl.createOrder);

// Customer orders
router.get('/me', auth, orderCtrl.listMyOrders);

// Farmer orders
router.get('/farmer', auth, requireRole('farmer'), orderCtrl.listFarmerOrders);

// Update status
router.patch('/:id/status', auth, orderCtrl.updateOrderStatus);

module.exports = router;