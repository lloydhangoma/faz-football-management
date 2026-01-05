import Transfer from '../../models/Transfer.js';
import Player from '../../models/Player.js';

export const receiveWebhook = async (req, res) => {
  try {
    const secret = req.headers['x-fifa-secret'] || req.query.secret;
    if (process.env.FIFA_WEBHOOK_SECRET && secret !== process.env.FIFA_WEBHOOK_SECRET) {
      console.warn('Invalid FIFA webhook secret');
      return res.status(401).json({ ok: false, message: 'Invalid signature' });
    }

    const payload = req.body || {};
    // Expect payload to contain either externalId or transferId
    const externalId = payload.externalId || payload.id || payload.external_id;
    const transferId = payload.transferId || payload.transfer_id || payload.transfer?.transferId;

    let transfer = null;
    if (externalId) transfer = await Transfer.findOne({ 'fifaExport.externalId': externalId });
    if (!transfer && transferId) transfer = await Transfer.findById(transferId);
    if (!transfer) {
      console.warn('FIFA webhook: transfer not found', { externalId, transferId });
      return res.status(404).json({ ok: false, message: 'Transfer not found' });
    }

    transfer.fifaExport = transfer.fifaExport || {};
    transfer.fifaExport.status = 'webhook_confirmed';
    transfer.fifaExport.externalId = transfer.fifaExport.externalId || externalId || null;
    transfer.fifaExport.exportedAt = transfer.fifaExport.exportedAt || new Date();
    transfer.fifaExport.lastAttemptAt = new Date();
    if (payload.raw) transfer.fifaExport.payload = payload.raw;
    await transfer.save();

    try {
      // update player's movementHistory and itcRecords for audit
      if (transfer.playerId) {
        const player = await Player.findById(transfer.playerId);
        if (player) {
          player.movementHistory = player.movementHistory || [];
          player.movementHistory.push({ action: 'Transferred', date: new Date(), reason: `Transfer exported to FIFA (${transfer._id})`, notes: JSON.stringify(payload) });
          await player.save();
        }
      }
    } catch (e) {
      console.warn('Failed to update player from FIFA webhook', e?.message || e);
    }

    return res.json({ ok: true, message: 'Webhook processed' });
  } catch (err) {
    console.error('FIFA webhook error', err);
    return res.status(500).json({ ok: false, message: 'Failed to process webhook' });
  }
};

export default { receiveWebhook };
