import Transfer from '../../models/Transfer.js';
import { enqueueTransferExport } from '../../jobs/transferQueue.js';

export const listPending = async (req, res) => {
  try {
    const pending = await Transfer.find({ status: 'Pending' }).populate('playerId fromClubId toClubId');
    res.json({ ok: true, pending });
  } catch (err) {
    console.error('List pending transfers error', err);
    res.status(500).json({ ok: false, message: 'Failed to list pending transfers' });
  }
};

export const getById = async (req, res) => {
  try {
    const t = await Transfer.findById(req.params.id).populate('playerId fromClubId toClubId');
    if (!t) return res.status(404).json({ ok: false, message: 'Transfer not found' });
    res.json({ ok: true, transfer: t });
  } catch (err) {
    console.error('Get transfer by id error', err);
    res.status(500).json({ ok: false, message: 'Failed to fetch transfer' });
  }
};

export const approveTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body || {};
    // include playerId so we can reference player profile if needed
    const transfer = await Transfer.findById(id).populate('playerId');
    if (!transfer) return res.status(404).json({ ok: false, message: 'Transfer not found' });

    // Enforce required documents before approving: require consent and contract be present
    const missing = [];
    if (!transfer.documents || !transfer.documents.consent || !transfer.documents.consent.url) missing.push('consent');
    if (!transfer.documents || !transfer.documents.contract || !transfer.documents.contract.url) missing.push('contract');
    if (missing.length > 0) {
      return res.status(400).json({ ok: false, message: `Missing required documents: ${missing.join(', ')}. Upload them to the transfer or attach them to the player's profile.` });
    }

    transfer.status = 'Accepted';
    transfer.statusHistory = transfer.statusHistory || [];
    transfer.statusHistory.push({ status: 'Accepted', changedBy: req.user._id, date: new Date(), notes: note });
    transfer.completionDate = new Date();
    await transfer.save();

    // When running without the worker (quick local testing), mark export as exported (dummy)
    try {
      if (req.user?.role === 'Super Admin') {
        const s = transfer.fifaExport?.status;
        if (!process.env.DISABLE_TRANSFER_WORKER || process.env.DISABLE_TRANSFER_WORKER === '0') {
          // worker enabled: enqueue background export
          if (!s || (s !== 'exported' && s !== 'exporting' && s !== 'webhook_confirmed')) {
            await enqueueTransferExport(transfer._id.toString());
          }
        } else {
          // worker disabled: set a dummy exported state so UI can show exported status for testing
          transfer.fifaExport = transfer.fifaExport || {};
          transfer.fifaExport.status = 'exported';
          transfer.fifaExport.externalId = transfer.fifaExport.externalId || `DUMMY-${transfer._id.toString()}`;
          transfer.fifaExport.exportedAt = new Date();
          await transfer.save();
        }
      }
    } catch (e) {
      console.warn('Failed to enqueue/mark transfer export', e?.message || e);
    }

    res.json({ ok: true, message: 'Transfer approved', transfer });
  } catch (err) {
    console.error('Approve transfer error', err);
    res.status(500).json({ ok: false, message: 'Failed to approve transfer' });
  }
};

export const rejectTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body || {};
    const transfer = await Transfer.findById(id);
    if (!transfer) return res.status(404).json({ ok: false, message: 'Transfer not found' });

    transfer.status = 'Rejected';
    transfer.statusHistory = transfer.statusHistory || [];
    transfer.statusHistory.push({ status: 'Rejected', changedBy: req.user._id, date: new Date(), notes: note });
    await transfer.save();

    res.json({ ok: true, message: 'Transfer rejected', transfer });
  } catch (err) {
    console.error('Reject transfer error', err);
    res.status(500).json({ ok: false, message: 'Failed to reject transfer' });
  }
};

export const triggerExport = async (req, res) => {
  try {
    const { id } = req.params;
    const transfer = await Transfer.findById(id);
    if (!transfer) return res.status(404).json({ ok: false, message: 'Transfer not found' });

    const s = transfer.fifaExport?.status;
    if (s === 'exported' || s === 'webhook_confirmed') return res.json({ ok: true, message: 'Already exported', transfer });

    await enqueueTransferExport(transfer._id.toString());
    return res.json({ ok: true, message: 'Export enqueued', transfer });
  } catch (err) {
    console.error('Trigger export error', err);
    return res.status(500).json({ ok: false, message: 'Failed to enqueue export' });
  }
};

export default { listPending, getById, approveTransfer, rejectTransfer, triggerExport };
