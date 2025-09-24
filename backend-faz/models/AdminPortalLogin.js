// models/AdminPortalLogin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminPortalLoginSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: [
        'Super Admin',
        'Manager',
        'Moderator',
        'Support Staff',
        'Policy Lead',
        'Content Editor',
      ],
      default: 'Moderator',
      required: true,
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 6 },
  },
  { timestamps: true }
);

// hash on create/change
adminPortalLoginSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare
adminPortalLoginSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const AdminPortalLogin = mongoose.model('AdminPortalLogin', adminPortalLoginSchema);
export default AdminPortalLogin;
