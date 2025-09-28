//utils/validators.js
const { body } = require('express-validator');

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('role').optional().isIn(['admin','farmer','customer'])
];

const loginValidation = [
  body('email').isEmail(),
  body('password').notEmpty()
];

const productValidation = [
  body('title').notEmpty(),
  body('price').isNumeric(),
  body('quantity').optional().isInt({ min: 0 })
];

module.exports = { registerValidation, loginValidation, productValidation };