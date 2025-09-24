import mongoose from 'mongoose';

// Schema to track auto-incrementing sequences (e.g. for reportId)
const reportersCounterSchema = new mongoose.Schema({
  _id: {
    type: String,        // Example: 'reportId'
    required: true,
  },
  seq: {
    type: Number,
    default: 0,          // First call will increment to 1 → RPT-001
  },
});

// Model name: ReportersCountersID → collection: reporterscountersids
export default mongoose.model('ReportersCountersID', reportersCounterSchema);
