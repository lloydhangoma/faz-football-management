//models/frontend/ClubRegistration/ApplyClubAccountModel.js

import mongoose from 'mongoose';

/** ---------- Reusable file subdocument ---------- */
const FileSchema = new mongoose.Schema(
  {
    fileName: { type: String, trim: true },
    fileType: { type: String, trim: true },
    fileSize: { type: Number },
    asset:    { type: Buffer, select: false }, // exclude heavy buffer unless explicitly selected
  },
  { _id: false }
);

/** ---------- Officials ---------- */
const OfficialSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, required: true },
    role:     { type: String, trim: true },
    nrc:      { type: String, trim: true },
  },
  { _id: false }
);

/** ---------- Review metadata ---------- */
const ReviewSchema = new mongoose.Schema({
  notes:     { type: String, trim: true },
  updatedBy: { type: String, trim: true }, // e.g., admin email/id
  updatedAt: { type: Date },
}, { _id: false });

/** ---------- Main application ---------- */
const ClubApplicationSchema = new mongoose.Schema(
  {
    // Step 1
    clubName:      { type: String, trim: true, required: true, index: true },
    yearFounded:   { type: String, trim: true },
    province:      { type: String, trim: true, required: true, index: true },
    district:      { type: String, trim: true, required: true, index: true },
    address:       { type: String, trim: true, required: true },
    licenseNumber: { type: String, trim: true },

    // Step 2
    contactName:   { type: String, trim: true, required: true, index: true },
    contactRole:   { type: String, trim: true },
    contactEmail:  { type: String, trim: true, required: true },
    contactPhone:  { type: String, trim: true },

    // Step 3
    officials:     { type: [OfficialSchema], default: [] },

    // Step 4: files as buffers
    documents: {
      constitution: FileSchema,
      clubLicense:  FileSchema,
      contactId:    FileSchema,
      supporting:   { type: [FileSchema], default: [] },
    },

    // workflow
    status: { 
      type: String,
      enum: [ 'pending',  'under-review', 'pending-docs', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    review: ReviewSchema,
  },
  { timestamps: true }
);

ClubApplicationSchema.index({ clubName: 1, createdAt: -1 });

const ClubApplication = mongoose.model('ClubApplication', ClubApplicationSchema);
export default ClubApplication;
