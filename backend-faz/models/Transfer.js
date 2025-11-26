import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema(
  {
    // Parties involved
    fromClubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClubsAdminPortalLogin',
      required: [true, 'From club is required'],
    },
    toClubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClubsAdminPortalLogin',
      required: [true, 'To club is required'],
    },
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player is required'],
    },

    // Transfer Details
    type: {
      type: String,
      enum: ['Permanent', 'Loan', 'Swap'],
      required: [true, 'Transfer type is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'In Negotiation', 'Accepted', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
    transferFee: Number,
    loanDuration: String, // e.g., "6 months", "1 year"
    
    // Dates
    requestDate: {
      type: Date,
      default: Date.now,
    },
    proposedDate: Date,
    completionDate: Date,

    // Details
    reason: String,
    comments: String,
    additionalTerms: String,

    // Counter Offers
    counterOffers: [
      {
        offeredByClubId: mongoose.Schema.Types.ObjectId,
        player: mongoose.Schema.Types.ObjectId, // if swapping players
        fee: Number,
        date: { type: Date, default: Date.now },
        status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
        terms: String,
      },
    ],

    // Status History
    statusHistory: [
      {
        status: String,
        changedBy: mongoose.Schema.Types.ObjectId, // admin who changed it
        date: { type: Date, default: Date.now },
        notes: String,
      },
    ],

    // FIFA / TMS export metadata
    fifaExport: {
      status: { type: String, enum: ['pending', 'exporting', 'exported', 'failed', 'webhook_confirmed', 'disabled'], default: 'pending' },
      externalId: { type: String, index: true }, // id returned by FIFA/TMS
      attempts: { type: Number, default: 0 },
      lastError: String,
      lastAttemptAt: Date,
      exportedAt: Date,
      payload: mongoose.Schema.Types.Mixed,
    },

    // FIFA Connect standard fields / mapping (stored for audit and export)
    fifaPayload: {
      requestType: String, // e.g., 'ITC_REQUEST', 'INTERNATIONAL_TRANSFER'
      playerIdentifiers: mongoose.Schema.Types.Mixed, // { fazId, fifaId, cafId, nationalId }
      playerPassport: {
        number: String,
        country: String,
        expiryDate: Date,
      },
      originAssociation: String,
      destinationAssociation: String,
      representative: {
        name: String,
        organization: String,
        contact: String,
      },
      agreement: {
        signedAt: Date,
        signedBy: String,
        terms: String,
      },
      raw: mongoose.Schema.Types.Mixed, // raw mapped payload used for export
    },

    // Transfer-scoped documents (if attachments are uploaded specifically for this transfer)
    documents: {
      consent: {
        url: String,
        uploadedAt: Date,
        uploadedByClubId: mongoose.Schema.Types.ObjectId,
      },
      contract: {
        url: String,
        uploadedAt: Date,
        uploadedByClubId: mongoose.Schema.Types.ObjectId,
      },
    },

    // Where documents were sourced from: 'playerProfile' means using files attached to the player's profile,
    // 'transfer' means transfer-scoped uploads were used.
    documentsSource: {
      type: String,
      enum: ['playerProfile', 'transfer', 'none'],
      default: 'none',
    },

    // Created by
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClubsAdminPortalLogin',
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for quick queries
transferSchema.index({ fromClubId: 1, status: 1 });
transferSchema.index({ toClubId: 1, status: 1 });
transferSchema.index({ playerId: 1 });

const Transfer = mongoose.model('Transfer', transferSchema);
export default Transfer;
