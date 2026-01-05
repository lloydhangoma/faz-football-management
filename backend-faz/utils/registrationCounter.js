import RegistrationCounter from '../models/RegistrationCounter.js';

const pad = (n, width = 6) => String(n).padStart(width, '0');

/**
 * Get next league registration string.
 * leagueCode: string (optional). If not provided, uses 'GEN'.
 * Returns { registrationNumber, seq }
 */
export async function getNextLeagueRegistrationNumber(leagueCode = 'GEN') {
  const key = `league:${(leagueCode || 'GEN').toString().toUpperCase()}`;

  const updated = await RegistrationCounter.findOneAndUpdate(
    { _id: key },
    { $inc: { seq: 1 }, $setOnInsert: { updatedAt: new Date() } },
    { new: true, upsert: true }
  ).lean();

  const seq = updated?.seq || 0;
  const registrationNumber = `FAZ-${(leagueCode || 'GEN').toString().toUpperCase()}-${pad(seq, 6)}`;
  return { registrationNumber, seq };
}

export default { getNextLeagueRegistrationNumber };
