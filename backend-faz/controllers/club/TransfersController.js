import Transfer from '../../models/Transfer.js';
import Player from '../../models/Player.js';
import stream from 'stream';
import cloudinary from '../../config/cloudinary.js';

const serializeTransfer = (t) => {
  if (!t) return null;
  const safeId = (obj) => (obj && obj._id) ? obj._id : obj;
  const clubFrom = t.fromClubId || null;
  const clubTo = t.toClubId || null;
  const player = t.playerId || null;
  const mapClub = (c) => {
    if (!c) return null;
    return {
      _id: safeId(c),
      name: c.club?.name || c.name || null,
      clubName: c.club?.name || c.clubName || c.name || null,
      abbreviation: c.club?.abbreviation || c.abbreviation || null,
    };
  };
  const mapPlayer = (p) => {
    if (!p) return null;
    return { _id: safeId(p), name: p.name || null, nrc: p.nrc || null, position: p.position || null };
  };
  const mapOffer = (o) => {
    if (!o) return null;
    return {
      _id: o._id,
      amount: o.fee ?? o.amount ?? null,
      fee: o.fee ?? o.amount ?? null,
      offeredByClubId: safeId(o.offeredByClubId) || null,
      offeredBy: o.offeredByClubId && typeof o.offeredByClubId === 'object' ? { _id: safeId(o.offeredByClubId), name: o.offeredByClubId.club?.name || o.offeredByClubId.name || null } : null,
      player: o.player || null,
      terms: o.terms || null,
      status: o.status || null,
      date: o.date || o.createdAt || null,
      timestamp: o.date || o.timestamp || o.createdAt || null,
    };
  };

  return {
    _id: t._id,
    player: mapPlayer(player),
    fromClub: mapClub(clubFrom),
    toClub: mapClub(clubTo),
    amount: t.transferFee ?? t.amount ?? null,
    transferFee: t.transferFee ?? t.amount ?? null,
    type: t.type || null,
    status: t.status || null,
    requestDate: t.requestDate || t.createdAt || null,
    completionDate: t.completionDate || null,
    counterOffers: (t.counterOffers || []).map(mapOffer),
    statusHistory: t.statusHistory || [],
    reason: t.reason || null,
    comments: t.comments || null,
  };
};

export const getTransfers = async (req, res) => {
  try {
    const clubId = req.clubId;
    const { status, type } = req.query;
    const filter = { $or: [ { fromClubId: clubId }, { toClubId: clubId } ] };
    if (status) filter.status = status;
    if (type) filter.type = type;

    const transfers = await Transfer.find(filter)
      .populate('fromClubId', 'club.name club.abbreviation')
      .populate('toClubId', 'club.name club.abbreviation')
      .populate('playerId', 'name position')
      .sort({ requestDate: -1 });
    const publicTransfers = transfers.map(serializeTransfer);
    return res.status(200).json({ ok: true, transfers: publicTransfers });
  } catch (err) {
    console.error('❌ Get transfers error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to fetch transfers' });
  }
};

export const getTransferById = async (req, res) => {
  try {
    const { transferId } = req.params;
    const clubId = req.clubId;
    const transfer = await Transfer.findOne({ _id: transferId, $or: [ { fromClubId: clubId }, { toClubId: clubId } ] })
      .populate('fromClubId', 'club.name club.abbreviation')
      .populate('toClubId', 'club.name club.abbreviation')
      .populate('playerId');

    if (!transfer) return res.status(404).json({ ok: false, message: 'Transfer not found' });
    const publicTransfer = serializeTransfer(transfer);
    return res.status(200).json({ ok: true, transfer: publicTransfer });
  } catch (err) {
    console.error('❌ Get transfer by ID error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to fetch transfer' });
  }
};

export const createTransfer = async (req, res) => {
  try {
    // Buying-club initiates transfer. `req.clubId` is the buying club (toClubId)
    const buyingClubId = req.clubId;
    const { fromClubId, playerId, type, transferFee, reason, comments, fifaPayload } = req.body;
    if (!fromClubId || !playerId || !type) return res.status(400).json({ ok: false, message: 'Missing required fields: fromClubId, playerId, type' });

    // Prevent buyer from attempting to transfer one of their own players
    if (String(fromClubId) === String(buyingClubId)) {
      console.warn('Attempted self-transfer blocked', { buyingClubId, fromClubId, user: req.user?._id });
      return res.status(400).json({ ok: false, message: 'Invalid request: fromClubId must be a different club than the requesting (buying) club' });
    }

    // Validate the player exists and determine the player's registered club using multiple common fields
    const player = await Player.findById(playerId).lean();
    if (!player) return res.status(404).json({ ok: false, message: 'Player not found' });

    const playerClubId = (player.club && (player.club._id || player.club)) || player.clubId || player.currentClubId || (player.currentClub && (player.currentClub._id || player.currentClub)) || null;
    if (!playerClubId) {
      console.error('Player missing club information', { playerId });
      return res.status(400).json({ ok: false, message: 'Player does not have an associated club on record' });
    }

    if (String(playerClubId) !== String(fromClubId)) {
      console.warn('Player ownership mismatch', { playerId, playerClubId, requestedFromClubId: fromClubId });
      return res.status(400).json({ ok: false, message: 'Player is not registered to the specified selling club (fromClubId)' });
    }

    const transfer = new Transfer({ fromClubId, toClubId: buyingClubId, playerId, type, transferFee, reason, comments, initiatedBy: req.user?._id || null, status: 'Pending' });

    // initial status history entry
    transfer.statusHistory = transfer.statusHistory || [];
    transfer.statusHistory.push({ status: 'Pending', changedBy: req.user?._id || null, date: new Date(), notes: 'Transfer created by buying club (initiated)' });

    // store any supplied FIFA mapping payload (validated/normalized by API caller)
    if (fifaPayload && typeof fifaPayload === 'object') {
      transfer.fifaPayload = transfer.fifaPayload || {};
      // preserve raw original mapping for auditing
      transfer.fifaPayload.raw = fifaPayload.raw || fifaPayload;
      // map common fields into normalized slots if present
      transfer.fifaPayload.requestType = fifaPayload.requestType || transfer.fifaPayload.requestType || null;
      transfer.fifaPayload.originAssociation = fifaPayload.originAssociation || transfer.fifaPayload.originAssociation || null;
      transfer.fifaPayload.destinationAssociation = fifaPayload.destinationAssociation || transfer.fifaPayload.destinationAssociation || null;
      transfer.fifaPayload.representative = fifaPayload.representative || transfer.fifaPayload.representative || null;
      transfer.fifaPayload.playerIdentifiers = fifaPayload.playerIdentifiers || transfer.fifaPayload.playerIdentifiers || null;
    }

    await transfer.save();
    await transfer.populate('fromClubId', 'club.name club.abbreviation');
    await transfer.populate('toClubId', 'club.name club.abbreviation');
    await transfer.populate('playerId', 'name position');

    const publicTransfer = serializeTransfer(transfer);
    return res.status(201).json({ ok: true, message: 'Transfer request created successfully', transfer: publicTransfer });
  } catch (err) {
    console.error('❌ Create transfer error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to create transfer' });
  }
};

export const acceptTransfer = async (req, res) => {
  try {
    const { transferId } = req.params;
    const clubId = req.clubId;
    // Seller (fromClubId) should accept a buyer-initiated request
    const transfer = await Transfer.findOne({ _id: transferId, fromClubId: clubId });
    if (!transfer) return res.status(404).json({ ok: false, message: 'Transfer request not found or you do not have permission to accept it' });
    if (transfer.status !== 'Pending' && transfer.status !== 'In Negotiation') return res.status(400).json({ ok: false, message: `Cannot accept transfer with status: ${transfer.status}` });

    transfer.status = 'Accepted';
    transfer.completionDate = new Date();
    transfer.statusHistory.push({ status: 'Accepted', changedBy: req.user?._id || null, date: new Date(), notes: 'Accepted by selling club' });

    await transfer.save();
    await transfer.populate('fromClubId', 'club.name club.abbreviation');
    await transfer.populate('toClubId', 'club.name club.abbreviation');
    await transfer.populate('playerId', 'name position');

    const publicTransfer = serializeTransfer(transfer);
    return res.status(200).json({ ok: true, message: 'Transfer request accepted', transfer: publicTransfer });
  } catch (err) {
    console.error('❌ Accept transfer error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to accept transfer' });
  }
};

export const rejectTransfer = async (req, res) => {
  try {
    const { transferId } = req.params;
    const clubId = req.clubId;
    const { reason } = req.body;
    const transfer = await Transfer.findOne({ _id: transferId, $or: [ { fromClubId: clubId }, { toClubId: clubId } ] });
    if (!transfer) return res.status(404).json({ ok: false, message: 'Transfer request not found' });

    transfer.status = 'Rejected';
    transfer.statusHistory.push({ status: 'Rejected', changedBy: req.user._id, date: new Date(), notes: reason });
    await transfer.save();
    await transfer.populate('fromClubId', 'club.name club.abbreviation');
    await transfer.populate('toClubId', 'club.name club.abbreviation');
    await transfer.populate('playerId', 'name position');

    const publicTransfer = serializeTransfer(transfer);
    return res.status(200).json({ ok: true, message: 'Transfer request rejected', transfer: publicTransfer });
  } catch (err) {
    console.error('❌ Reject transfer error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to reject transfer' });
  }
};

export const createCounterOffer = async (req, res) => {
  try {
    const { transferId } = req.params;
    const clubId = req.clubId;
    const { fee, playerId: counterPlayerId, terms } = req.body;
    const transfer = await Transfer.findOne({ _id: transferId, $or: [ { fromClubId: clubId }, { toClubId: clubId } ] });
    if (!transfer) return res.status(404).json({ ok: false, message: 'Transfer request not found' });

    const counterOffer = { offeredByClubId: clubId, fee, player: counterPlayerId, terms, date: new Date(), status: 'Pending' };
    transfer.counterOffers.push(counterOffer);
    transfer.status = 'In Negotiation';
    await transfer.save();
    await transfer.populate('fromClubId', 'club.name club.abbreviation');
    await transfer.populate('toClubId', 'club.name club.abbreviation');
    await transfer.populate('playerId', 'name position');

    const publicTransfer = serializeTransfer(transfer);
    return res.status(200).json({ ok: true, message: 'Counter offer created', transfer: publicTransfer });
  } catch (err) {
    console.error('❌ Create counter offer error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to create counter offer' });
  }
};

export const acceptCounterOffer = async (req, res) => {
  try {
    const { transferId, offerId } = req.params;
    const clubId = req.clubId;
    const transfer = await Transfer.findOne({ _id: transferId, $or: [ { fromClubId: clubId }, { toClubId: clubId } ] });
    if (!transfer) return res.status(404).json({ ok: false, message: 'Transfer request not found' });

    const counterOffer = transfer.counterOffers.id(offerId);
    if (!counterOffer) return res.status(404).json({ ok: false, message: 'Counter offer not found' });

    counterOffer.status = 'Accepted';
    transfer.status = 'Accepted';
    transfer.completionDate = new Date();

    await transfer.save();
    await transfer.populate('fromClubId', 'club.name club.abbreviation');
    await transfer.populate('toClubId', 'club.name club.abbreviation');
    await transfer.populate('playerId', 'name position');

    const publicTransfer = serializeTransfer(transfer);
    return res.status(200).json({ ok: true, message: 'Counter offer accepted', transfer: publicTransfer });
  } catch (err) {
    console.error('❌ Accept counter offer error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to accept counter offer' });
  }
};

export const cancelTransfer = async (req, res) => {
  try {
    const { transferId } = req.params;
    const clubId = req.clubId;
    const transfer = await Transfer.findOne({ _id: transferId, fromClubId: clubId });
    if (!transfer) return res.status(404).json({ ok: false, message: 'Transfer request not found or you do not have permission to cancel it' });

    transfer.status = 'Cancelled';
    transfer.statusHistory.push({ status: 'Cancelled', changedBy: req.user._id, date: new Date() });
    await transfer.save();

    return res.status(200).json({ ok: true, message: 'Transfer request cancelled' });
  } catch (err) {
    console.error('❌ Cancel transfer error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to cancel transfer' });
  }
};

const uploadBuffer = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const pass = new stream.PassThrough();
    const opts = {
      folder: folder || process.env.CLOUDINARY_FOLDER || 'faz/transfers',
      resource_type: 'auto',
      overwrite: true,
    };
    const up = cloudinary.uploader.upload_stream(opts, (err, result) => (err ? reject(err) : resolve(result)));
    pass.end(buffer);
    pass.pipe(up);
  });

export const uploadTransferDocuments = async (req, res) => {
  try {
    const { transferId } = req.params;
    const clubId = req.clubId;
    const transfer = await Transfer.findById(transferId);
    if (!transfer) return res.status(404).json({ ok: false, message: 'Transfer not found' });

    // Only buyer or seller may upload documents for this transfer
    const allowed = String(clubId) === String(transfer.fromClubId) || String(clubId) === String(transfer.toClubId);
    if (!allowed) return res.status(403).json({ ok: false, message: 'You do not have permission to upload documents for this transfer' });

    const files = req.files || {};
    // files may include 'consent' and 'contract'
    if (files.consent && files.consent[0]) {
      const file = files.consent[0];
      if (file.buffer) {
        const up = await uploadBuffer(file.buffer, process.env.CLOUDINARY_FOLDER ? `${process.env.CLOUDINARY_FOLDER}/transfers` : 'faz/transfers');
        transfer.documents = transfer.documents || {};
        transfer.documents.consent = { url: up.secure_url, uploadedAt: new Date(), uploadedByClubId: clubId };
      }
    }
    if (files.contract && files.contract[0]) {
      const file = files.contract[0];
      if (file.buffer) {
        const up = await uploadBuffer(file.buffer, process.env.CLOUDINARY_FOLDER ? `${process.env.CLOUDINARY_FOLDER}/transfers` : 'faz/transfers');
        transfer.documents = transfer.documents || {};
        transfer.documents.contract = { url: up.secure_url, uploadedAt: new Date(), uploadedByClubId: clubId };
      }
    }

    transfer.documentsSource = 'transfer';
    await transfer.save();
    await transfer.populate('fromClubId', 'club.name club.abbreviation');
    await transfer.populate('toClubId', 'club.name club.abbreviation');
    await transfer.populate('playerId', 'name position');

    const publicTransfer = serializeTransfer(transfer);
    return res.status(200).json({ ok: true, message: 'Documents uploaded', transfer: publicTransfer });
  } catch (err) {
    console.error('❌ Upload transfer documents error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to upload documents' });
  }
};

export default { getTransfers, getTransferById, createTransfer, acceptTransfer, rejectTransfer, createCounterOffer, acceptCounterOffer, cancelTransfer };
