import Transfer from '../models/Transfer.js';
import Player from '../models/Player.js';

// Helper: normalize a Transfer mongoose doc into the shape frontend expects
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
    return {
      _id: safeId(p),
      name: p.name || null,
      nrc: p.nrc || null,
      position: p.position || null,
    };
  };

  const mapOffer = (o) => {
    if (!o) return null;
    return {
      _id: o._id,
      amount: o.fee ?? o.amount ?? null,
      fee: o.fee ?? o.amount ?? null,
      offeredByClubId: safeId(o.offeredByClubId) || null,
      offeredBy: o.offeredByClubId && typeof o.offeredByClubId === 'object'
        ? { _id: safeId(o.offeredByClubId), name: o.offeredByClubId.club?.name || o.offeredByClubId.name || null }
        : null,
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

/**
 * GET /api/transfers - Get transfers for the authenticated club (incoming and outgoing)
 */
export const getTransfers = async (req, res) => {
  try {
    const clubId = req.clubId;
    const { status, type } = req.query;

    const filter = {
      $or: [
        { fromClubId: clubId },
        { toClubId: clubId },
      ],
    };

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

/**
 * GET /api/transfers/:transferId - Get a single transfer
 */
export const getTransferById = async (req, res) => {
  try {
    const { transferId } = req.params;
    const clubId = req.clubId;

    const transfer = await Transfer.findOne({
      _id: transferId,
      $or: [
        { fromClubId: clubId },
        { toClubId: clubId },
      ],
    })
      .populate('fromClubId', 'club.name club.abbreviation')
      .populate('toClubId', 'club.name club.abbreviation')
      .populate('playerId');

    if (!transfer) {
      return res.status(404).json({ ok: false, message: 'Transfer not found' });
    }

    const publicTransfer = serializeTransfer(transfer);
    return res.status(200).json({ ok: true, transfer: publicTransfer });
  } catch (err) {
    console.error('❌ Get transfer by ID error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to fetch transfer' });
  }
};

/**
 * POST /api/transfers - Create a new transfer request
 */
export const createTransfer = async (req, res) => {
  try {
    const clubId = req.clubId;
    const { toClubId, playerId, type, transferFee, reason, comments } = req.body;

    if (!toClubId || !playerId || !type) {
      return res.status(400).json({
        ok: false,
        message: 'Missing required fields: toClubId, playerId, type',
      });
    }

    // Verify player exists and belongs to the club
    const player = await Player.findOne({ _id: playerId, clubId });
    if (!player) {
      return res.status(404).json({ ok: false, message: 'Player not found in your club' });
    }

    // Create transfer
    const transfer = new Transfer({
      fromClubId: clubId,
      toClubId,
      playerId,
      type,
      transferFee,
      reason,
      comments,
      initiatedBy: req.user._id,
      status: 'Pending',
    });

    await transfer.save();
    await transfer.populate('fromClubId', 'club.name club.abbreviation');
    await transfer.populate('toClubId', 'club.name club.abbreviation');
    await transfer.populate('playerId', 'name position');

    const publicTransfer = serializeTransfer(transfer);
    return res.status(201).json({
      ok: true,
      message: 'Transfer request created successfully',
      transfer: publicTransfer,
    });
  } catch (err) {
    console.error('❌ Create transfer error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to create transfer' });
  }
};

/**
 * PUT /api/transfers/:transferId/accept - Accept a transfer request
 */
export const acceptTransfer = async (req, res) => {
  try {
    const { transferId } = req.params;
    const clubId = req.clubId;

    const transfer = await Transfer.findOne({
      _id: transferId,
      toClubId: clubId, // Only the receiving club can accept
    });

    if (!transfer) {
      return res.status(404).json({
        ok: false,
        message: 'Transfer request not found or you do not have permission to accept it',
      });
    }

    if (transfer.status !== 'Pending' && transfer.status !== 'In Negotiation') {
      return res.status(400).json({
        ok: false,
        message: `Cannot accept transfer with status: ${transfer.status}`,
      });
    }

    transfer.status = 'Accepted';
    transfer.completionDate = new Date();
    transfer.statusHistory.push({
      status: 'Accepted',
      changedBy: req.user._id,
      date: new Date(),
    });

    await transfer.save();
    await transfer.populate('fromClubId', 'club.name club.abbreviation');
    await transfer.populate('toClubId', 'club.name club.abbreviation');
    await transfer.populate('playerId', 'name position');

    const publicTransfer = serializeTransfer(transfer);
    return res.status(200).json({
      ok: true,
      message: 'Transfer request accepted',
      transfer: publicTransfer,
    });
  } catch (err) {
    console.error('❌ Accept transfer error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to accept transfer' });
  }
};

/**
 * PUT /api/transfers/:transferId/reject - Reject a transfer request
 */
export const rejectTransfer = async (req, res) => {
  try {
    const { transferId } = req.params;
    const clubId = req.clubId;
    const { reason } = req.body;

    const transfer = await Transfer.findOne({
      _id: transferId,
      $or: [
        { fromClubId: clubId },
        { toClubId: clubId },
      ],
    });

    if (!transfer) {
      return res.status(404).json({
        ok: false,
        message: 'Transfer request not found',
      });
    }

    transfer.status = 'Rejected';
    transfer.statusHistory.push({
      status: 'Rejected',
      changedBy: req.user._id,
      date: new Date(),
      notes: reason,
    });

    await transfer.save();
    await transfer.populate('fromClubId', 'club.name club.abbreviation');
    await transfer.populate('toClubId', 'club.name club.abbreviation');
    await transfer.populate('playerId', 'name position');

    const publicTransfer = serializeTransfer(transfer);
    return res.status(200).json({
      ok: true,
      message: 'Transfer request rejected',
      transfer: publicTransfer,
    });
  } catch (err) {
    console.error('❌ Reject transfer error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to reject transfer' });
  }
};

/**
 * POST /api/transfers/:transferId/counter-offer - Create a counter offer
 */
export const createCounterOffer = async (req, res) => {
  try {
    const { transferId } = req.params;
    const clubId = req.clubId;
    const { fee, playerId: counterPlayerId, terms } = req.body;

    const transfer = await Transfer.findOne({
      _id: transferId,
      $or: [
        { fromClubId: clubId },
        { toClubId: clubId },
      ],
    });

    if (!transfer) {
      return res.status(404).json({
        ok: false,
        message: 'Transfer request not found',
      });
    }

    const counterOffer = {
      offeredByClubId: clubId,
      fee,
      player: counterPlayerId,
      terms,
      date: new Date(),
      status: 'Pending',
    };

    transfer.counterOffers.push(counterOffer);
    transfer.status = 'In Negotiation';

    await transfer.save();
    await transfer.populate('fromClubId', 'club.name club.abbreviation');
    await transfer.populate('toClubId', 'club.name club.abbreviation');
    await transfer.populate('playerId', 'name position');

    const publicTransfer = serializeTransfer(transfer);
    return res.status(200).json({
      ok: true,
      message: 'Counter offer created',
      transfer: publicTransfer,
    });
  } catch (err) {
    console.error('❌ Create counter offer error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to create counter offer' });
  }
};

/**
 * PUT /api/transfers/:transferId/counter-offer/:offerId/accept - Accept a counter offer
 */
export const acceptCounterOffer = async (req, res) => {
  try {
    const { transferId, offerId } = req.params;
    const clubId = req.clubId;

    const transfer = await Transfer.findOne({
      _id: transferId,
      $or: [
        { fromClubId: clubId },
        { toClubId: clubId },
      ],
    });

    if (!transfer) {
      return res.status(404).json({
        ok: false,
        message: 'Transfer request not found',
      });
    }

    const counterOffer = transfer.counterOffers.id(offerId);
    if (!counterOffer) {
      return res.status(404).json({
        ok: false,
        message: 'Counter offer not found',
      });
    }

    counterOffer.status = 'Accepted';
    transfer.status = 'Accepted';
    transfer.completionDate = new Date();

    await transfer.save();
    await transfer.populate('fromClubId', 'club.name club.abbreviation');
    await transfer.populate('toClubId', 'club.name club.abbreviation');
    await transfer.populate('playerId', 'name position');

    const publicTransfer = serializeTransfer(transfer);
    return res.status(200).json({
      ok: true,
      message: 'Counter offer accepted',
      transfer: publicTransfer,
    });
  } catch (err) {
    console.error('❌ Accept counter offer error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to accept counter offer' });
  }
};

/**
 * DELETE /api/transfers/:transferId - Cancel a transfer request
 */
export const cancelTransfer = async (req, res) => {
  try {
    const { transferId } = req.params;
    const clubId = req.clubId;

    const transfer = await Transfer.findOne({
      _id: transferId,
      fromClubId: clubId, // Only the originating club can cancel
    });

    if (!transfer) {
      return res.status(404).json({
        ok: false,
        message: 'Transfer request not found or you do not have permission to cancel it',
      });
    }

    transfer.status = 'Cancelled';
    transfer.statusHistory.push({
      status: 'Cancelled',
      changedBy: req.user._id,
      date: new Date(),
    });

    await transfer.save();

    return res.status(200).json({
      ok: true,
      message: 'Transfer request cancelled',
    });
  } catch (err) {
    console.error('❌ Cancel transfer error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to cancel transfer' });
  }
};
