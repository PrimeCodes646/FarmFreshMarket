// controllers/user.controller.js
const User = require('../models/User');

// Admin: list users (with query by role)
exports.listUsers = async (req, res) => {
  const { role } = req.query;
  const query = role ? { role } : {};
  try {
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Admin: approve or block farmer
exports.updateApproval = async (req, res) => {
  const { id } = req.params;
  const { approved } = req.body; // true/false
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.approved = !!approved;
    await user.save();
    res.json({ message: `User ${approved ? 'approved' : 'blocked'}`, user: { id: user._id, approved: user.approved } });
  } catch (err) {
    res.status(500).json({ message: 'Error updating approval' });
  }
};

// Profile (get current user)
exports.getProfile = async (req, res) => {
  res.json(req.user);
};

// Update profile (user)
exports.updateProfile = async (req, res) => {
  const updates = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};