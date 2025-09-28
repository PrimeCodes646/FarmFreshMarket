// controllers/order.controller.js
const Order = require('../models/Order');
const Product = require('../models/Product');

// Create order (customer)
exports.createOrder = async (req, res) => {
  try {
    if (req.user.role !== 'customer') return res.status(403).json({ message: 'Only customers can place orders' });

    const { items, shippingAddress } = req.body;
    // items: [{ productId, quantity }, ...]

    let total = 0;
    const productsList = [];

    for (const it of items) {
      const prod = await Product.findById(it.productId);
      if (!prod) return res.status(400).json({ message: `Product ${it.productId} not found` });
      if (!prod.verified) return res.status(400).json({ message: `Product ${prod.title} not available` });
      if (prod.quantity < it.quantity) return res.status(400).json({ message: `Insufficient stock for ${prod.title}` });

      // reduce stock (simple flow)
      prod.quantity -= it.quantity;
      await prod.save();

      total += prod.price * it.quantity;
      productsList.push({
        product: prod._id,
        quantity: it.quantity,
        priceAtOrder: prod.price
      });
    }

    // For multi-farmer carts you'd group per farmer; for simplicity assume single farmer or single-farmer cart.
    const farmerId = (await Product.findById(items[0].productId)).farmer;

    const order = new Order({
      buyer: req.user._id,
      farmer: farmerId,
      products: productsList,
      total,
      shippingAddress
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Customer: list my orders
exports.listMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).populate('products.product').sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Farmer: list orders for their products
exports.listFarmerOrders = async (req, res) => {
  try {
    if (req.user.role !== 'farmer') return res.status(403).json({ message: 'Only farmers' });
    const orders = await Order.find({ farmer: req.user._id }).populate('buyer products.product').sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching farmer orders' });
  }
};

// Update order status (farmer or admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // only farmer who owns the order or admin can update
    if (req.user.role !== 'admin' && req.user._id.toString() !== order.farmer.toString()) {
      return res.status(403).json({ message: 'Not authorized to update order' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};