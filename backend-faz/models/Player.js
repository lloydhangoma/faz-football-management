import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema(
  {
    // Basic Information
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClubsAdminPortalLogin',
      required: [true, 'Club ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Player name is required'],
      trim: true,
    },
    nrc: {
      type: String,
      required: [true, 'NRC is required'],
      unique: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    age: {
      type: Number,
      get() {
        if (!this.dateOfBirth) return null;
        const today = new Date();
        let age = today.getFullYear() - this.dateOfBirth.getFullYear();
        const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())) {
          age--;
        }
        return age;
      },
    },
    nationality: {
      type: String,
      required: [true, 'Nationality is required'],
      default: 'Zambian',
    },
    position: {
      type: String,
      enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
      required: [true, 'Position is required'],
    },

    // Contact Information
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },

    // Physical Attributes
    physicalAttributes: {
      height: { type: Number }, // in cm
      weight: { type: Number }, // in kg
      preferredFoot: { type: String, enum: ['Left', 'Right', 'Both'] },
      bloodType: { type: String },
    },

    // Professional IDs
    leagueRegistrationNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    registrationLeague: {
      type: String,
      trim: true,
    },
    registrationAssignedAt: {
      type: Date,
    },
    registrationAssignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminPortalLogin',
    },
    fazId: {
      type: String,
      unique: true,
      sparse: true,
    },
    cafId: {
      type: String,
      unique: true,
      sparse: true,
    },
    fifaId: {
      type: String,
      unique: true,
      sparse: true,
    },
    // FIFA / TMS and passport details
    passportNumber: {
      type: String,
      trim: true,
      sparse: true,
    },
    passportCountry: {
      type: String,
      trim: true,
    },
    passportExpiry: Date,
    placeOfBirth: String,
    countryOfBirth: String,
    guardian: {
      name: String,
      relationship: String,
      phone: String,
      email: String,
    },

    // International Transfer Certificate (ITC) / TMS records
    itcRecords: [
      {
        itcNumber: String,
        issuedBy: String, // federation/association
        issuedDate: Date,
        season: String,
        status: { type: String, enum: ['Issued', 'Pending', 'Rejected', 'Cancelled'], default: 'Pending' },
        notes: String,
      },
    ],

    // Registration & historic registrations (per season/association)
    registrationHistory: [
      {
        association: String,
        registrationNumber: String,
        competition: String,
        season: String,
        startDate: Date,
        endDate: Date,
        status: { type: String, enum: ['Active', 'Expired', 'Suspended', 'Cancelled'], default: 'Active' },
      },
    ],

    // Status
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended', 'Retired'],
      default: 'Active',
    },
    currentStatus: {
      registrationStatus: {
        type: String,
        enum: ['Pending Approval', 'Approved', 'Rejected', 'Under Review'],
        default: 'Pending Approval',
      },
      eligibilityStatus: {
        type: String,
        enum: ['Eligible', 'Ineligible', 'Under Review', 'Conditional'],
        default: 'Under Review',
      },
      lastVerificationDate: Date,
      verificationNotes: String,
      verificationHistory: [
        {
          action: { type: String, enum: ['Approved', 'Rejected', 'Reviewed'], required: true },
          by: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminPortalLogin' },
          role: String,
          note: String,
          force: { type: Boolean, default: false },
          date: { type: Date, default: Date.now },
        },
      ],
    },

    // Contract Information
    contractExpiry: Date,
    valuation: Number, // in currency units

    // Emergency Contact
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
      email: String,
      address: String,
    },

    // Statistics - Current Season
    stats: {
      goals: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
      appearances: { type: Number, default: 0 },
      yellowCards: { type: Number, default: 0 },
      redCards: { type: Number, default: 0 },
    },

    // Statistics - Career
    careerStats: {
      totalGoals: { type: Number, default: 0 },
      totalAssists: { type: Number, default: 0 },
      totalAppearances: { type: Number, default: 0 },
      totalYellowCards: { type: Number, default: 0 },
      totalRedCards: { type: Number, default: 0 },
    },

    // Documents
    documents: {
      passport: {
        filename: String,
        path: String, // Cloudinary URL
        uploadDate: Date,
        verified: Boolean,
        verificationDate: Date,
      },
      medicalCertificate: {
        filename: String,
        path: String,
        uploadDate: Date,
        verified: Boolean,
        verificationDate: Date,
      },
      certificate: {
        filename: String,
        path: String,
        uploadDate: Date,
        verified: Boolean,
        verificationDate: Date,
      },
      birthCertificate: {
        filename: String,
        path: String,
        uploadDate: Date,
        verified: Boolean,
        verificationDate: Date,
      },
    },

    // Movement History
    movementHistory: [
      {
        action: String, // "Signed", "Transferred", "Loaned", "Released", etc.
        date: Date,
        reason: String,
        notes: String,
        status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Completed' },
      },
    ],

    // Avatar/Photo
    avatar: String, // Cloudinary URL

    // Document Completeness
    documentCompleteness: {
      total: { type: Number, default: 4 },
      uploaded: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
      missing: [String],
    },

    // Metadata
    joined: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

// Ensure club has permission to access player
playerSchema.index({ clubId: 1, email: 1 });
playerSchema.index({ clubId: 1, nrc: 1 });

const Player = mongoose.model('Player', playerSchema);
export default Player;
