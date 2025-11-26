import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    // Teams
    homeTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClubsAdminPortalLogin',
      required: [true, 'Home team is required'],
    },
    awayTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClubsAdminPortalLogin',
      required: [true, 'Away team is required'],
    },

    // Match Details
    date: {
      type: Date,
      required: [true, 'Match date is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
    },
    competition: {
      type: String,
      enum: ['League', 'Cup', 'Friendly', 'Playoff', 'Other'],
      default: 'League',
    },
    season: String,
    round: String, // e.g., "Week 1", "Semi-final"

    // Match Status
    status: {
      type: String,
      enum: ['Scheduled', 'Live', 'Completed', 'Postponed', 'Cancelled'],
      default: 'Scheduled',
    },

    // Score
    homeTeamScore: { type: Number, default: 0 },
    awayTeamScore: { type: Number, default: 0 },
    extraTimeScore: {
      home: Number,
      away: Number,
    },
    penaltyScore: {
      home: Number,
      away: Number,
    },

    // Lineups
    homeTeamLineup: [
      {
        playerId: mongoose.Schema.Types.ObjectId,
        position: String,
        shirtNumber: Number,
        substitutedIn: Boolean,
        substitutedInMinute: Number,
        goals: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        yellowCards: { type: Number, default: 0 },
        redCards: { type: Number, default: 0 },
      },
    ],
    awayTeamLineup: [
      {
        playerId: mongoose.Schema.Types.ObjectId,
        position: String,
        shirtNumber: Number,
        substitutedIn: Boolean,
        substitutedInMinute: Number,
        goals: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        yellowCards: { type: Number, default: 0 },
        redCards: { type: Number, default: 0 },
      },
    ],

    // Substitutions
    homeTeamSubstitutions: [
      {
        playerOutId: mongoose.Schema.Types.ObjectId,
        playerInId: mongoose.Schema.Types.ObjectId,
        minute: Number,
        reason: String,
      },
    ],
    awayTeamSubstitutions: [
      {
        playerOutId: mongoose.Schema.Types.ObjectId,
        playerInId: mongoose.Schema.Types.ObjectId,
        minute: Number,
        reason: String,
      },
    ],

    // Match Events
    goals: [
      {
        scoredBy: mongoose.Schema.Types.ObjectId,
        assistedBy: mongoose.Schema.Types.ObjectId,
        minute: Number,
        isOwnGoal: Boolean,
        isPenalty: Boolean,
        team: { type: String, enum: ['Home', 'Away'] },
      },
    ],
    cards: [
      {
        playerId: mongoose.Schema.Types.ObjectId,
        cardType: { type: String, enum: ['Yellow', 'Red'] },
        minute: Number,
        reason: String,
        team: { type: String, enum: ['Home', 'Away'] },
      },
    ],

    // Officials
    referee: String,
    assistantReferee1: String,
    assistantReferee2: String,
    fourthOfficial: String,

    // Notes
    notes: String,
    attendance: Number,
  },
  { timestamps: true }
);

// Indexes
matchSchema.index({ date: 1, status: 1 });
matchSchema.index({ homeTeamId: 1 });
matchSchema.index({ awayTeamId: 1 });

const Match = mongoose.model('Match', matchSchema);
export default Match;
