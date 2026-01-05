import { Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import axios from 'axios';
import Transfer from '../models/Transfer.js';
import Player from '../models/Player.js';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let connection = null;

const FIFA_API_URL = process.env.FIFA_API_URL || process.env.FAKE_FIFA_ENDPOINT || 'http://localhost:4001/fifa-mock';
const FIFA_API_KEY = process.env.FIFA_API_KEY || '';

async function mapTransferToFifaPayload(transfer) {
  // Minimal mapping — extend to FIFA Connect schema as required
  await transfer.populate('playerId fromClubId toClubId');
  const player = transfer.playerId;
  const fromClub = transfer.fromClubId;
  const toClub = transfer.toClubId;

  const payload = {
    transferId: transfer._id.toString(),
    player: {
      id: player._id.toString(),
      name: player.name,
      nrc: player.nrc,
      dateOfBirth: player.dateOfBirth,
      nationality: player.nationality,
    },
    fromClub: { id: fromClub._id.toString(), name: fromClub.club?.name || fromClub.name },
    toClub: { id: toClub._id.toString(), name: toClub.club?.name || toClub.name },
    type: transfer.type,
    transferFee: transfer.transferFee ?? null,
    requestedAt: transfer.requestDate || transfer.createdAt,
  };
  return payload;
}

let worker = null;
if (process.env.NODE_ENV !== 'test' && process.env.DISABLE_TRANSFER_WORKER !== '1') {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    // Determine max retries from env (use 1 in dev to avoid noisy reconnection loops)
    let maxRetries = 1;
    if (process.env.REDIS_MAX_RETRIES_PER_REQUEST && process.env.REDIS_MAX_RETRIES_PER_REQUEST !== 'null') {
      const n = Number(process.env.REDIS_MAX_RETRIES_PER_REQUEST);
      if (!Number.isNaN(n)) maxRetries = n;
    } else if (process.env.REDIS_MAX_RETRIES_PER_REQUEST === 'null') {
      maxRetries = null;
    }

    // Set a reasonable connect timeout so missing Redis doesn't hang the process
    const IORedisMod = await import('ioredis');
    const IORedis = IORedisMod.default || IORedisMod;
    connection = new IORedis(redisUrl, { maxRetriesPerRequest: maxRetries, connectTimeout: 2000 });

    connection.on('error', (err) => {
      console.warn('⚠️ Transfer exporter: Redis connection error:', err?.message || err);
      if (worker) {
        // best-effort shutdown
        worker.close().catch(() => {});
        worker = null;
      }
    });

    worker = new Worker(
      'transfer-export',
      async (job) => {
        const { transferId } = job.data;
        const transfer = await Transfer.findById(transferId);
        if (!transfer) throw new Error('Transfer not found');

        // Idempotency: if already exported, skip
        if (transfer.fifaExport?.status === 'exported' || transfer.fifaExport?.status === 'webhook_confirmed') {
          return { ok: true, message: 'Already exported' };
        }

        // prepare payload
        const payload = await mapTransferToFifaPayload(transfer);

        transfer.fifaExport = transfer.fifaExport || {};
        transfer.fifaExport.status = 'exporting';
        transfer.fifaExport.attempts = (transfer.fifaExport.attempts || 0) + 1;
        transfer.fifaExport.lastAttemptAt = new Date();
        transfer.fifaExport.payload = payload;
        await transfer.save();

        try {
          const headers = { 'Content-Type': 'application/json' };
          if (FIFA_API_KEY) headers['Authorization'] = `Bearer ${FIFA_API_KEY}`;

          const resp = await axios.post(`${FIFA_API_URL}/transfers`, payload, { headers, timeout: 30000 });

          // Expecting { ok: true, id: 'externalId' }
          const externalId = resp?.data?.id || resp?.data?.externalId || null;

          transfer.fifaExport.status = 'exported';
          transfer.fifaExport.externalId = externalId || transfer.fifaExport.externalId;
          transfer.fifaExport.exportedAt = new Date();
          transfer.fifaExport.lastError = undefined;
          await transfer.save();

          return { ok: true, externalId };
        } catch (err) {
          transfer.fifaExport.status = 'failed';
          transfer.fifaExport.lastError = err?.message || String(err);
          await transfer.save();
          throw err;
        }
      },
      { connection, concurrency: 2 }
    );

    const qEvents = new QueueEvents('transfer-export', { connection });
    qEvents.on('completed', ({ jobId }) => {
      console.log('Transfer export job completed', jobId);
    });
    qEvents.on('failed', ({ jobId, failedReason }) => {
      console.warn('Transfer export job failed', jobId, failedReason);
    });

    console.log('✅ Transfer exporter worker started');
  } catch (err) {
    console.warn('⚠️ Transfer exporter worker not started (Redis/bullmq issue):', err?.message || err);
    worker = null;
  }
}

export default worker;
