// middleware/roles.js

// Usage: requireRole('admin') or requireRole('farmer','admin')
const requireRole = (...allowed) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden — insufficient permissions' });
  }
  next();
};

module.exports = { requireRole };