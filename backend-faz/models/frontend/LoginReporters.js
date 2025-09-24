import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Dedicated Reporter schema
const reporterUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  role: {
    type: String,
    default: 'reporter',
    enum: ['reporter'], // ✅ locked to reporter only
    required: true
  },
  password: { type: String, required: true },
  organization: { type: String, default: '' },

  // ✅ Cloudinary URL for profile image
  profileImage: { type: String, default: null },

  // ✅ Admin controls
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  },
  verified: {
    type: Boolean,
    default: false
  },

  // ✅ Track last login/activity timestamp
  lastActive: {
    type: Date,
    default: null
  }

}, { timestamps: true });

// 🔐 Compare entered password with hashed one
reporterUserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔐 Hash password before saving
reporterUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const ReporterUser = mongoose.model('ReporterUser', reporterUserSchema);
export default ReporterUser;
