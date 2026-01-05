//middleware/adminAuth.js

import jwt from 'jsonwebtoken';
import AdminPortalLogin from '../models/AdminPortalLogin.js';

export const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.adminToken;
    if (!token) {
      return res.status(401).json({ ok: false, message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminPortalLogin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ ok: false, message: 'Admin not found' });
    }

    // keep both for compatibility
    req.user = admin;
    req.admin = admin;
    next();
  } catch (err) {
    console.error('❌ Auth middleware error:', err?.message || err);
    const message = err?.name === 'TokenExpiredError'
      ? 'Session expired. Please log in again.'
      : 'Not authenticated';
    return res.status(401).json({ ok: false, message });
  }
};

/**
 * requireRole - restricts access to users who have the required role or are Super Admin
 * @param {string|string[]} requiredRole
 */
export const requireRole = (requiredRole) => (req, res, next) => {
  const user = req.admin || req.user;
  if (!user) return res.status(401).json({ ok: false, message: 'Not authenticated' });
  const required = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  if (required.includes(user.role) || user.role === 'Super Admin') return next();
  return res.status(403).json({ ok: false, message: 'Forbidden' });
};
