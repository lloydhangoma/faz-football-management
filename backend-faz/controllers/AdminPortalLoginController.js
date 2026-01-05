// controllers/AdminPortalLoginController.js
// controllers/AdminPortalLoginController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import AdminPortalLogin from '../models/AdminPortalLogin.js';

const isProd = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: process.env.COOKIE_SAME_SITE || (isProd ? 'Strict' : 'Lax'),
  domain: process.env.COOKIE_DOMAIN || undefined,
  path: '/',
  maxAge: 24 * 60 * 60 * 1000,
};

const requireJwt = () => {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET is not configured');
  return s;
};

const signToken = (payload) => jwt.sign(payload, requireJwt(), { expiresIn: '1d' });

// 🔐 POST /api/settings/admin-login
export const loginAdmin = async (req, res) => {
  try {
    requireJwt();

    let { email, password } = req.body || {};
    email = String(email || '').toLowerCase().trim();
    password = String(password || '');

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Email and password are required' });
    }

    const admin = await AdminPortalLogin.findOne({ email });
    if (!admin) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

    const okPw = await admin.matchPassword(password);
    if (!okPw) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

    const token = signToken({ id: admin._id, role: admin.role });
    res.cookie('adminToken', token, cookieOptions);

    return res.status(200).json({
      ok: true,
      admin: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    console.error('Login Error:', err);
    const msg = err?.message?.includes('JWT_SECRET') ? 'Server not configured for auth' : 'Internal server error';
    return res.status(500).json({ ok: false, message: msg });
  }
};

// 🧪 GET /api/settings/admin-check-auth
export const checkAdminAuth = async (req, res) => {
  try {
    const token = req.cookies?.adminToken;
    if (!token) return res.status(401).json({ ok: false, message: 'Not authenticated' });

    const decoded = jwt.verify(token, requireJwt());
    const admin = await AdminPortalLogin.findById(decoded.id).select('-password');
    if (!admin) return res.status(401).json({ ok: false, message: 'Admin not found' });

    return res.status(200).json({ ok: true, admin });
  } catch (err) {
    const expired = err?.name === 'TokenExpiredError';
    return res.status(401).json({
      ok: false,
      message: expired ? 'Session expired. Please log in again.' : 'Invalid token',
    });
  }
};

// 🚪 POST /api/settings/admin-logout
export const logoutAdmin = (_req, res) => {
  res.clearCookie('adminToken', cookieOptions);
  return res.status(200).json({ ok: true, message: 'Logged out successfully' });
};

// 📄 GET /api/settings/admins
export const getAdmins = async (_req, res) => {
  try {
    const admins = await AdminPortalLogin.find({}, '-password').sort({ createdAt: -1 });
    return res.status(200).json({ ok: true, admins });
  } catch {
    return res.status(500).json({ ok: false, message: 'Failed to fetch admins' });
  }
};

// ➕ POST /api/settings/admins
export const createAdmin = async (req, res) => {
  try {
    let { name, email, role, password } = req.body || {};
    email = String(email || '').toLowerCase().trim();

    if (!name || !email || !role || !password) {
      return res.status(400).json({ ok: false, message: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters long' });
    }

    const exists = await AdminPortalLogin.findOne({ email });
    if (exists) return res.status(400).json({ ok: false, message: 'Admin already exists' });

    const admin = new AdminPortalLogin({ name, email, role, password });
    await admin.save();

    return res.status(201).json({ ok: true, message: 'Admin created successfully', id: admin._id });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ ok: false, message: 'Email already in use' });
    }
    console.error('Create Error:', err);
    return res.status(500).json({ ok: false, message: 'Server error creating admin' });
  }
};

// 📝 PUT /api/settings/admins/:id
export const updateAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, email, role, password } = req.body || {};

    const admin = await AdminPortalLogin.findById(id);
    if (!admin) return res.status(404).json({ ok: false, message: 'Admin not found' });

    if (name) admin.name = name;
    if (email) admin.email = String(email).toLowerCase().trim();
    if (role) admin.role = role;

    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters long' });
      }
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    await admin.save();
    return res.status(200).json({ ok: true, message: 'Admin updated successfully' });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ ok: false, message: 'Email already in use' });
    }
    console.error('Update Error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to update admin' });
  }
};

// ❌ DELETE /api/settings/admins/:id
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await AdminPortalLogin.findByIdAndDelete(id);
    return res.status(200).json({ ok: true, message: 'Admin deleted successfully' });
  } catch {
    return res.status(500).json({ ok: false, message: 'Failed to delete admin' });
  }
};
