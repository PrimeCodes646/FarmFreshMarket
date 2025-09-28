// routes/users.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const userController = require('../controllers/user.controller');

router.get('/me', auth, userController.getProfile);
router.put('/me', auth, userController.updateProfile);

// Admin routes:
router.get('/', auth, requireRole('admin'), userController.listUsers);
router.patch('/:id/approval', auth, requireRole('admin'), userController.updateApproval);

module.exports = router;