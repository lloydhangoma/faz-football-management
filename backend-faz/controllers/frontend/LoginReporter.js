// 📁 File: controllers/frontend/LoginReporter.js

import ReporterUser from '../../models/frontend/LoginReporters.js';
import ViolationReport from '../../models/frontend/reporter/ViolationReports.js';

import jwt from 'jsonwebtoken';

// 🔐 Signup — only for reporters
export const registerReporter = async (req, res) => {
  const { fullName, email, password, role, organization, profileImage } = req.body;

  try {
    const exists = await ReporterUser.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const user = new ReporterUser({
      fullName,
      email,
      password,
      role: 'reporter', // ✅ hardcoded to protect role
      organization,
      profileImage
    });

    await user.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// 🔐 Login — only for reporters
export const loginReporter = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await ReporterUser.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.role !== 'reporter') {
      return res.status(403).json({ message: 'Not authorized as a reporter' });
    }

    // ✅ NEW: Prevent suspended reporters from logging in
    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact support.' });
    }

    // ✅ Update last active time
    user.lastActive = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('frontendToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        organization: user.organization,
        profileImage: user.profileImage
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};


// 🚪 Logout
export const logoutReporter = (req, res) => {
  res.clearCookie('frontendToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

// 👤 Get reporter profile
export const getReporterProfile = async (req, res) => {
  try {
    const user = await ReporterUser.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'Reporter not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

// ✏️ Update reporter profile
export const updateReporterProfile = async (req, res) => {
  try {
    const reporter = await ReporterUser.findById(req.user._id);
    if (!reporter) return res.status(404).json({ message: 'User not found' });

    const { fullName, email, password, profileImage, organization } = req.body;

    if (fullName) reporter.fullName = fullName;
    if (email) reporter.email = email;
    if (organization) reporter.organization = organization;
    if (profileImage) reporter.profileImage = profileImage;
    if (password) reporter.password = password;

    await reporter.save();
    res.status(200).json({ message: 'Profile updated successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
};











// ✅ GET all reporters for adminreportermanagement (with pagination)
export const getAllReporters = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await ReporterUser.countDocuments();

    const reporters = await ReporterUser.find()
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const enrichedReporters = await Promise.all(
      reporters.map(async (reporter) => {
        const reportsCount = await ViolationReport.countDocuments({ reporterId: reporter._id });

        return {
          ...reporter.toObject(),
          reportsCount,
          lastActive: reporter.lastActive || null  // Will show if field is added to schema
        };
      })
    );

    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: enrichedReporters
    });

  } catch (error) {
    console.error("🔥 Get All Reporters Error:", error);
    res.status(500).json({ message: "Failed to fetch reporters", error: error.message });
  }
};



// ✅ PUT: Toggle a reporter's status between 'active' and 'suspended'
export const toggleReporterStatus = async (req, res) => {
  try {
    const reporter = await ReporterUser.findById(req.params.id);
    if (!reporter) return res.status(404).json({ message: 'Reporter not found' });

    reporter.status = reporter.status === 'active' ? 'suspended' : 'active';
    await reporter.save();

    res.status(200).json({
      message: `Reporter is now ${reporter.status}`,
      reporter
    });
  } catch (err) {
    console.error('Toggle Status Error:', err);
    res.status(500).json({ message: 'Failed to toggle status' });
  }
};


// ✅ GET count of active reporters
export const getActiveReportersCount = async (req, res) => {
  try {
    const count = await ReporterUser.countDocuments({ status: 'active' });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting active reporters:', error);
    res.status(500).json({ message: 'Failed to get active reporters count' });
  }
};



// ✅ PUT: Toggle a reporter's verified status
export const toggleReporterVerified = async (req, res) => {
  try {
    const reporter = await ReporterUser.findById(req.params.id);
    if (!reporter) return res.status(404).json({ message: 'Reporter not found' });

    reporter.verified = !reporter.verified;
    await reporter.save();

    res.status(200).json({
      message: `Reporter marked as ${reporter.verified ? 'verified' : 'unverified'}`,
      reporter
    });
  } catch (error) {
    console.error('Toggle Reporter Verified Error:', error);
    res.status(500).json({ message: 'Failed to toggle verified status' });
  }
};


// ✅ PUT: Reset a reporter's password (admin-defined password required in body)
export const resetReporterPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const reporter = await ReporterUser.findById(req.params.id);
    if (!reporter) return res.status(404).json({ message: 'Reporter not found' });

    reporter.password = newPassword; // will be hashed by pre-save middleware
    await reporter.save();

    res.status(200).json({ message: 'Reporter password reset successfully' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};


// ✅ DELETE: Permanently delete a reporter account
export const deleteReporter = async (req, res) => {
  try {
    const reporter = await ReporterUser.findByIdAndDelete(req.params.id);
    if (!reporter) return res.status(404).json({ message: 'Reporter not found' });

    res.status(200).json({ message: 'Reporter deleted successfully' });
  } catch (error) {
    console.error('Delete Reporter Error:', error);
    res.status(500).json({ message: 'Failed to delete reporter' });
  }
};

