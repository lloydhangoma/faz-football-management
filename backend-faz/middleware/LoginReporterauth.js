// 📁 File: middleware/LoginReporterauth.js

import jwt from 'jsonwebtoken';
import ReporterUser from '../models/frontend/LoginReporters.js';

// 🔐 Middleware to protect reporter-only routes
export const protectReporter = async (req, res, next) => {
  try {
    // ⛔ Check if token exists in cookies
    const token = req.cookies.frontendToken;

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // ✅ Verify token and fetch reporter user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await ReporterUser.findById(decoded.id).select('-password');

    if (!user || user.role !== 'reporter') {
      return res.status(403).json({ message: 'Access denied: reporter only' });
    }

    req.user = user; // ✅ Attach user to request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token verification failed' });
  }
};
