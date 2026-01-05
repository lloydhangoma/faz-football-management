// controllers/Clubs-Management-Panel/Clubs-AdminPortalLoginController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import stream from 'stream';
import cloudinary from '../../config/cloudinary.js';
import ClubsAdminPortalLogin from '../../models/Clubs-Management-Panel/Clubs-AdminPortalLogin.js';

const isProd = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'Strict' : 'Lax',
  path: '/',
  maxAge: 24 * 60 * 60 * 1000,
};

const requireJwt = () => {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET is not configured');
  return s;
};
const signToken = (payload) => jwt.sign(payload, requireJwt(), { expiresIn: '1d' });

/** ✅ FIXED: Cloudinary buffer upload helper */
const uploadBuffer = (buffer, folder) =>
  new Promise((resolve, reject) => {
    try {
      const pass = new stream.PassThrough();
      const opts = {
        folder: folder || process.env.CLOUDINARY_FOLDER || 'faz/clubs',
        resource_type: 'image',
        overwrite: true,
      };
      const uploader = cloudinary.uploader.upload_stream(opts, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
      pass.end(buffer);
      pass.pipe(uploader);
    } catch (e) {
      reject(e);
    }
  });

/** POST /api/clubs-panel/admin-login */
export const loginAdmin = async (req, res) => {
  try {
    requireJwt();
    let { email, password } = req.body || {};
    email = String(email || '').toLowerCase().trim();
    password = String(password || '');

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Email and password are required' });
    }

    const admin = await ClubsAdminPortalLogin.findOne({ email });
    if (!admin) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

    const okPw = await admin.matchPassword(password);
    if (!okPw) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

    const token = signToken({ id: admin._id, role: admin.role });
    res.cookie('adminToken', token, cookieOptions);

    return res.status(200).json({
      ok: true,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        club: {
          name: admin.club?.name || '',
          logoUrl: admin.club?.logo?.url || '',
        },
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    const msg = err?.message?.includes('JWT_SECRET')
      ? 'Server not configured for auth'
      : 'Internal server error';
    return res.status(500).json({ ok: false, message: msg });
  }
};

/** GET /api/clubs-panel/admin-check-auth */
export const checkAdminAuth = async (req, res) => {
  try {
    const token = req.cookies?.adminToken;
    if (!token) return res.status(401).json({ ok: false, message: 'Not authenticated' });

    const decoded = jwt.verify(token, requireJwt());
    const admin = await ClubsAdminPortalLogin.findById(decoded.id).select('-password');
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

/** POST /api/clubs-panel/admin-logout */
export const logoutAdmin = (_req, res) => {
  res.clearCookie('adminToken', cookieOptions);
  return res.status(200).json({ ok: true, message: 'Logged out successfully' });
};

/** GET /api/clubs-panel/admins */
export const getAdmins = async (_req, res) => {
  try {
    const admins = await ClubsAdminPortalLogin.find({}, '-password').sort({ createdAt: -1 });
    return res.status(200).json({ ok: true, admins });
  } catch {
    return res.status(500).json({ ok: false, message: 'Failed to fetch admins' });
  }
};

/** POST /api/clubs-panel/admins */
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

    const exists = await ClubsAdminPortalLogin.findOne({ email });
    if (exists) return res.status(400).json({ ok: false, message: 'Admin already exists' });

    const admin = new ClubsAdminPortalLogin({ name, email, role, password });
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

/** PUT /api/clubs-panel/admins/:id */
export const updateAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, email, role, password } = req.body || {};

    const admin = await ClubsAdminPortalLogin.findById(id);
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

/** DELETE /api/clubs-panel/admins/:id */
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await ClubsAdminPortalLogin.findByIdAndDelete(id);
    return res.status(200).json({ ok: true, message: 'Admin deleted successfully' });
  } catch {
    return res.status(500).json({ ok: false, message: 'Failed to delete admin' });
  }
};

/** 🌱 POST /api/clubs-panel/club/register */
export const registerClub = async (req, res) => {
  try {
    const required = (v) => typeof v === 'string' && v.trim().length > 0;

    const email = String(req.body.email || '').toLowerCase().trim();
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Email and password are required' });
    }

    // ✅ add this:
    if (password.length < 6) {
      return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters long' });
    }

    if (!required(req.body.clubName) || !required(req.body.province) || !required(req.body.league)) {
      return res.status(400).json({ ok: false, message: 'Missing required club fields (clubName, province, league)' });
    }

    const exists = await ClubsAdminPortalLogin.findOne({ email });
    if (exists) return res.status(400).json({ ok: false, message: 'Account with this email already exists' });


    // Optional Cloudinary upload
    let logo = { url: '', publicId: '' };
    if (req.file?.buffer) {
      try {
        const up = await uploadBuffer(req.file.buffer, process.env.CLOUDINARY_FOLDER);
        logo = { url: up.secure_url, publicId: up.public_id };
      } catch (e) {
        console.error('Cloudinary upload failed:', e?.message || e);
        // Don’t block registration if logo upload fails; just proceed without logo
        logo = { url: '', publicId: '' };
      }
    }

    const admin = await ClubsAdminPortalLogin.create({
      name: `${req.body.clubName} Admin`,
      email,
      role: 'Club Admin',
      password,
      club: {
        name: req.body.clubName,
        abbreviation: req.body.clubAbbreviation || '',
        logo,
        homeStadium: req.body.homeStadium || '',
        province: req.body.province,
        foundingYear: req.body.foundingYear ? Number(req.body.foundingYear) : undefined,
        league: req.body.league,
        currentLeaguePosition: req.body.currentLeaguePosition ? Number(req.body.currentLeaguePosition) : undefined,
        previousLeaguePosition: req.body.previousLeaguePosition ? Number(req.body.previousLeaguePosition) : undefined,
        leagueTitles: req.body.leagueTitles ? Number(req.body.leagueTitles) : 0,
        cupsWon: req.body.cupsWon ? Number(req.body.cupsWon) : 0,
        presidentName: req.body.presidentName || '',
        contactPhone: req.body.contactPhone || '',
        websiteUrl: req.body.websiteUrl || '',
        socialMediaLinks: req.body.socialMediaLinks || '',
      },
    });

    return res.status(201).json({
      ok: true,
      message: 'Club registered successfully. You can log in now.',
      admin: { _id: admin._id, email: admin.email, role: admin.role },
      club: {
        name: admin.club?.name,
        logoUrl: admin.club?.logo?.url || '',
        province: admin.club?.province,
        league: admin.club?.league,
      }
    });
  } catch (e) {
    console.error('registerClub failed:', e);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
};
