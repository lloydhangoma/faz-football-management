import stream from 'stream';
import cloudinary from '../../config/cloudinary.js';
import Player from '../../models/Player.js';

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Upload a buffer to Cloudinary with simple retry logic for transient failures (timeouts, network blips).
 * Returns the Cloudinary upload result or throws the last error.
 */
const uploadBuffer = async (buffer, folder) => {
  const opts = {
    folder: folder || process.env.CLOUDINARY_FOLDER || 'faz/players',
    resource_type: 'auto',
    overwrite: true,
  };

  const maxAttempts = 3;
  let attempt = 0;
  let lastErr = null;

  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      const pass = new stream.PassThrough();
      const upPromise = new Promise((resolve, reject) => {
        const up = cloudinary.uploader.upload_stream(opts, (err, result) => (err ? reject(err) : resolve(result)));
        pass.end(buffer);
        pass.pipe(up);
      });

      const result = await upPromise;
      return result;
    } catch (err) {
      lastErr = err;
      // If this looks like a transient timeout/network error, retry after a short delay.
      const isTimeout = err && (err.name === 'TimeoutError' || err.http_code === 499 || /timeout/i.test(err.message || ''));
      console.warn(`Cloudinary upload attempt ${attempt} failed${isTimeout ? ' (timeout)' : ''}:`, err?.message || err);
      if (attempt < maxAttempts && isTimeout) {
        // exponential backoff
        await sleep(500 * attempt);
        continue;
      }
      // do not retry for other error types
      break;
    }
  }

  // throw the last error for upstream handling
  throw lastErr;
};

export const getPlayers = async (req, res) => {
  try {
    const { status, position, nationality, registrationStatus, eligibilityStatus, search } = req.query;
    const clubId = req.clubId;

    const filter = { clubId };

    if (status) filter.status = status;
    if (position) filter.position = position;
    if (nationality) filter.nationality = nationality;
    if (registrationStatus) filter['currentStatus.registrationStatus'] = registrationStatus;
    if (eligibilityStatus) filter['currentStatus.eligibilityStatus'] = eligibilityStatus;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nrc: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const players = await Player.find(filter)
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({ ok: true, players });
  } catch (err) {
    console.error('❌ Get players error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to fetch players' });
  }
};

export const getPlayerById = async (req, res) => {
  try {
    const { playerId } = req.params;
    const clubId = req.clubId;

    const player = await Player.findOne({ _id: playerId, clubId });

    if (!player) return res.status(404).json({ ok: false, message: 'Player not found' });

    return res.status(200).json({ ok: true, player });
  } catch (err) {
    console.error('❌ Get player by ID error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to fetch player' });
  }
};

export const createPlayer = async (req, res) => {
  try {
    const clubId = req.clubId;
    const raw = req.body || {};
    const name = raw.name;
    const nrc = raw.nrc;
    const dateOfBirth = raw.dateOfBirth;
    const nationality = raw.nationality;
    const position = raw.position;
    const email = raw.email;
    const phone = raw.phone;
    const physicalAttributes = raw.physicalAttributes ? (typeof raw.physicalAttributes === 'string' ? JSON.parse(raw.physicalAttributes) : raw.physicalAttributes) : {};
    const emergencyContact = raw.emergencyContact ? (typeof raw.emergencyContact === 'string' ? JSON.parse(raw.emergencyContact) : raw.emergencyContact) : {};
    const guardian = raw.guardian ? (typeof raw.guardian === 'string' ? JSON.parse(raw.guardian) : raw.guardian) : null;
    const passportNumber = raw.passportNumber || raw.passport_number || null;
    const passportCountry = raw.passportCountry || raw.passport_country || null;
    const passportExpiry = raw.passportExpiry || raw.passport_expiry || null;
    const placeOfBirth = raw.placeOfBirth || raw.place_of_birth || null;
    const countryOfBirth = raw.countryOfBirth || raw.country_of_birth || null;
    const fifaId = raw.fifaId || null;

    if (!name || !nrc || !dateOfBirth || !position || !email || !phone) {
      // Debug information to help diagnose missing fields or malformed requests
      try {
        console.error('Create player validation failed - missing required fields', {
          presentKeys: Object.keys(req.body || {}),
          files: Object.keys(req.files || {}),
          clubId: req.clubId,
        });
      } catch (logErr) {
        console.error('Failed to log createPlayer debug info', logErr);
      }
      return res.status(400).json({ ok: false, message: 'Missing required fields: name, nrc, dateOfBirth, position, email, phone' });
    }

    const exists = await Player.findOne({ clubId, $or: [{ nrc }, { email }] });
    if (exists) {
      try {
        console.warn('Create player rejected - duplicate exists', {
          existingId: exists._id?.toString(),
          presentKeys: Object.keys(req.body || {}),
          clubId: req.clubId,
        });
      } catch (logErr) {
        console.warn('Failed to log duplicate createPlayer debug info', logErr);
      }

      // Determine which field(s) conflict to give a clearer error message
      const conflicts = [];
      try {
        if (exists.nrc && nrc && exists.nrc.toString() === nrc.toString()) conflicts.push('nrc');
      } catch (e) {}
      try {
        if (exists.email && email && exists.email.toString().toLowerCase() === email.toString().toLowerCase()) conflicts.push('email');
      } catch (e) {}

      const message = conflicts.length === 1
        ? `Player with this ${conflicts[0].toUpperCase()} already exists in your club` 
        : 'Player with this NRC or email already exists in your club';

      return res.status(400).json({ ok: false, message, existingId: exists._id?.toString(), conflicts });
    }

    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = null;
    if (!isNaN(dob.getTime())) {
      age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    }

    const files = req.files || {};
    const parentalConsentFile = (files.parentalConsent && files.parentalConsent[0]) || null;

    if (age !== null && age < 18) {
      if (!guardian && !parentalConsentFile) {
        try {
          console.error('Create player validation failed - minor without guardian or parental consent', {
            age,
            presentKeys: Object.keys(req.body || {}),
            files: Object.keys(req.files || {}),
            clubId: req.clubId,
          });
        } catch (logErr) {
          console.error('Failed to log createPlayer minor debug info', logErr);
        }
        return res.status(400).json({ ok: false, message: 'Players under 18 require a guardian object or parental consent file.' });
      }
    }

    const playerData = {
      clubId,
      name,
      nrc,
      dateOfBirth: dob,
      nationality: nationality || 'Zambian',
      position,
      email,
      phone,
      physicalAttributes: physicalAttributes || {},
      emergencyContact: emergencyContact || {},
      guardian: guardian || undefined,
      passportNumber: passportNumber || undefined,
      passportCountry: passportCountry || undefined,
      passportExpiry: passportExpiry ? new Date(passportExpiry) : undefined,
      placeOfBirth: placeOfBirth || undefined,
      countryOfBirth: countryOfBirth || undefined,
      fifaId: fifaId || undefined,
      currentStatus: {
        registrationStatus: 'Pending Approval',
        eligibilityStatus: 'Under Review',
      },
    };

    const player = new Player(playerData);

    try {
      const uploadMap = {};
      for (const [fieldName, arr] of Object.entries(files)) {
        if (!arr || !arr[0]) continue;
        const file = arr[0];
        if (!file.buffer) continue;
        const up = await uploadBuffer(file.buffer, process.env.CLOUDINARY_FOLDER ? `${process.env.CLOUDINARY_FOLDER}/players` : 'faz/players');
        if (['avatar'].includes(fieldName)) {
          player.avatar = up.secure_url;
        } else if (['birthCertificate'].includes(fieldName)) {
          player.documents = player.documents || {};
          player.documents.birthCertificate = { filename: file.originalname, path: up.secure_url, uploadDate: new Date(), verified: false };
        } else if (['medicalClearance'].includes(fieldName)) {
          player.documents = player.documents || {};
          player.documents.medicalCertificate = { filename: file.originalname, path: up.secure_url, uploadDate: new Date(), verified: false };
        } else if (['educationCertificate'].includes(fieldName)) {
          player.documents = player.documents || {};
          player.documents.certificate = { filename: file.originalname, path: up.secure_url, uploadDate: new Date(), verified: false };
        } else if (['passport'].includes(fieldName)) {
          player.documents = player.documents || {};
          player.documents.passport = { filename: file.originalname, path: up.secure_url, uploadDate: new Date(), verified: false };
        } else if (['parentalConsent'].includes(fieldName)) {
          player.documents = player.documents || {};
          player.documents.parentalConsent = { filename: file.originalname, path: up.secure_url, uploadDate: new Date(), verified: false };
        } else if (['workPermit'].includes(fieldName)) {
          player.documents = player.documents || {};
          player.documents.workPermit = { filename: file.originalname, path: up.secure_url, uploadDate: new Date(), verified: false };
        }
        uploadMap[fieldName] = up;
      }
    } catch (uploadErr) {
      console.error('File upload error:', uploadErr);
      return res.status(500).json({ ok: false, message: 'Failed to upload files' });
    }

    await player.save();

    return res.status(201).json({ ok: true, message: 'Player created successfully', player });
  } catch (err) {
    console.error('❌ Create player error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ ok: false, message: 'Player with this NRC or email already exists' });
    }
    return res.status(500).json({ ok: false, message: 'Failed to create player' });
  }
};

export const updatePlayer = async (req, res) => {
  try {
    const { playerId } = req.params;
    const clubId = req.clubId;
    const raw = req.body || {};
    const updates = {};
    const allowedFields = [
      'name','dateOfBirth','nationality','position','email','phone','valuation','contractExpiry',
      'physicalAttributes','emergencyContact','guardian','passportNumber','passportCountry','passportExpiry','placeOfBirth','countryOfBirth','fifaId'
    ];
    for (const key of Object.keys(raw)) {
      if (allowedFields.includes(key)) {
        let value = raw[key];
        if ((key === 'physicalAttributes' || key === 'emergencyContact' || key === 'guardian') && typeof value === 'string') {
          try { value = JSON.parse(value); } catch (e) { }
        }
        updates[key] = value;
      }
    }

    delete updates.clubId;
    delete updates.nrc;

    const files = req.files || {};
    try {
      for (const [fieldName, arr] of Object.entries(files)) {
        if (!arr || !arr[0]) continue;
        const file = arr[0];
        if (!file.buffer) continue;
        const up = await uploadBuffer(file.buffer, process.env.CLOUDINARY_FOLDER ? `${process.env.CLOUDINARY_FOLDER}/players` : 'faz/players');
        if (['avatar'].includes(fieldName)) {
          updates.avatar = up.secure_url;
        } else if (['birthCertificate'].includes(fieldName)) {
          updates['documents.birthCertificate'] = { filename: file.originalname, path: up.secure_url, uploadDate: new Date(), verified: false };
        } else if (['medicalClearance'].includes(fieldName)) {
          updates['documents.medicalCertificate'] = { filename: file.originalname, path: up.secure_url, uploadDate: new Date(), verified: false };
        } else if (['educationCertificate'].includes(fieldName)) {
          updates['documents.certificate'] = { filename: file.originalname, path: up.secure_url, uploadDate: new Date(), verified: false };
        } else if (['passport'].includes(fieldName)) {
          updates['documents.passport'] = { filename: file.originalname, path: up.secure_url, uploadDate: new Date(), verified: false };
        } else if (['parentalConsent'].includes(fieldName)) {
          updates['documents.parentalConsent'] = { filename: file.originalname, path: up.secure_url, uploadDate: new Date(), verified: false };
        } else if (['workPermit'].includes(fieldName)) {
          updates['documents.workPermit'] = { filename: file.originalname, path: up.secure_url, uploadDate: new Date(), verified: false };
        }
      }
    } catch (uploadErr) {
      console.error('File upload error (update):', uploadErr);
      return res.status(500).json({ ok: false, message: 'Failed to upload files' });
    }

    const player = await Player.findOneAndUpdate(
      { _id: playerId, clubId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!player) return res.status(404).json({ ok: false, message: 'Player not found' });

    return res.status(200).json({ ok: true, message: 'Player updated successfully', player });
  } catch (err) {
    console.error('❌ Update player error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ ok: false, message: 'Email or other unique field already exists' });
    }
    return res.status(500).json({ ok: false, message: 'Failed to update player' });
  }
};

export const deletePlayer = async (req, res) => {
  try {
    const { playerId } = req.params;
    const clubId = req.clubId;

    const player = await Player.findOneAndDelete({ _id: playerId, clubId });
    if (!player) return res.status(404).json({ ok: false, message: 'Player not found' });

    return res.status(200).json({ ok: true, message: 'Player deleted successfully' });
  } catch (err) {
    console.error('❌ Delete player error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to delete player' });
  }
};

export const updatePlayerStatus = async (req, res) => {
  try {
    const { playerId } = req.params;
    const clubId = req.clubId;
    const { registrationStatus, eligibilityStatus, verificationNotes } = req.body;

    const updates = {};
    if (registrationStatus) updates['currentStatus.registrationStatus'] = registrationStatus;
    if (eligibilityStatus) updates['currentStatus.eligibilityStatus'] = eligibilityStatus;
    if (verificationNotes) updates['currentStatus.verificationNotes'] = verificationNotes;
    updates['currentStatus.lastVerificationDate'] = new Date();

    const player = await Player.findOneAndUpdate(
      { _id: playerId, clubId },
      { $set: updates },
      { new: true }
    );

    if (!player) return res.status(404).json({ ok: false, message: 'Player not found' });

    return res.status(200).json({ ok: true, message: 'Player status updated successfully', player });
  } catch (err) {
    console.error('❌ Update player status error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to update player status' });
  }
};

export const addPlayerMovement = async (req, res) => {
  try {
    const { playerId } = req.params;
    const clubId = req.clubId;
    const { action, reason, notes, status } = req.body;

    if (!action) return res.status(400).json({ ok: false, message: 'Action is required' });

    const player = await Player.findOneAndUpdate(
      { _id: playerId, clubId },
      { $push: { movementHistory: { action, date: new Date(), reason, notes, status: status || 'Completed' } } },
      { new: true }
    );

    if (!player) return res.status(404).json({ ok: false, message: 'Player not found' });

    return res.status(201).json({ ok: true, message: 'Movement recorded successfully', player });
  } catch (err) {
    console.error('❌ Add player movement error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to record movement' });
  }
};

export default { getPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer, updatePlayerStatus, addPlayerMovement };
