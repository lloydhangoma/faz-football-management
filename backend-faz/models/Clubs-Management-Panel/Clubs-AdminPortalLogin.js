// controllers/Clubs-Management-Panel/Clubs-AdminPortalLogin.js



import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const clubsAdminPortalLoginSchema = new mongoose.Schema(
  {
    // Auth
    name: { type: String, required: [true, 'Name is required'] },
    email: {
      type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true,
    },
    role: {
      type: String,
      enum: [
        'Super Admin','Manager','Moderator','Support Staff','Policy Lead','Content Editor',
        'Club Admin','Club Manager','Club Editor',
      ],
      default: 'Club Admin',
      required: true,
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 6 },

    // Club profile (embedded)
    club: {
      name: { type: String, trim: true },
      abbreviation: { type: String, trim: true },
      logo: { url: { type: String, default: '' }, publicId: { type: String, default: '' } },
      homeStadium: { type: String, trim: true },
      province: { type: String, trim: true },
      foundingYear: { type: Number },
      league: { type: String, trim: true },
      currentLeaguePosition: { type: Number },
      previousLeaguePosition: { type: Number },
      leagueTitles: { type: Number, default: 0 },
      cupsWon: { type: Number, default: 0 },
      presidentName: { type: String, trim: true },
      contactPhone: { type: String, trim: true },
      websiteUrl: { type: String, trim: true },
      socialMediaLinks: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

clubsAdminPortalLoginSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

clubsAdminPortalLoginSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const ClubsAdminPortalLogin = mongoose.model('ClubsAdminPortalLogin', clubsAdminPortalLoginSchema);
export default ClubsAdminPortalLogin;
