// middleware/Clubs-AdminPortal-Auth.js
import jwt from 'jsonwebtoken';
import ClubsAdminPortalLogin from '../models/Clubs-Management-Panel/Clubs-AdminPortalLogin.js';

export const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.adminToken;
    if (!token) return res.status(401).json({ ok: false, message: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await ClubsAdminPortalLogin.findById(decoded.id).select('-password');
    if (!admin) return res.status(401).json({ ok: false, message: 'Admin not found' });

    req.user = admin;
    next();
  } catch (err) {
    console.error('❌ Auth middleware error:', err?.message || err);
    const message = err?.name === 'TokenExpiredError'
      ? 'Session expired. Please log in again.'
      : 'Not authenticated';
    return res.status(401).json({ ok: false, message });
  }
};
