import mongoose from 'mongoose';

const RegistrationCounterSchema = new mongoose.Schema({
  _id: { type: String }, // key: e.g. 'league:ZPL' or 'global'
  seq: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

const RegistrationCounter = mongoose.model('RegistrationCounter', RegistrationCounterSchema, 'counters');

export default RegistrationCounter;
