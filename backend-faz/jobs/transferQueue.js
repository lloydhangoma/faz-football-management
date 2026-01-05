let queue = null;
let connection = null;

async function ensureQueue() {
  if (queue) return queue;

  // If worker disabled, don't attempt to load redis/bull — caller should handle it
  if (process.env.DISABLE_TRANSFER_WORKER === '1') {
    console.log('ℹ️ Transfer worker disabled (enqueue no-op)');
    return null;
  }

  try {
    const { Queue } = await import('bullmq');
    const IORedisMod = await import('ioredis');
    const IORedis = IORedisMod.default || IORedisMod;
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    connection = new IORedis(redisUrl);
    queue = new Queue('transfer-export', { connection });
    return queue;
  } catch (err) {
    // If dynamic import fails (package not installed), we log and return null so callers won't crash
    console.warn('⚠️ transferQueue: failed to initialize queue (bullmq/ioredis missing?):', err?.message || err);
    return null;
  }
}

export async function enqueueTransferExport(transferId, opts = {}) {
  const q = await ensureQueue();
  if (!q) {
    // Queue not available (worker disabled or deps missing) — return null instead of throwing
    return null;
  }

  // Use idempotent jobId so re-enqueue attempts won't create duplicates
  const jobId = `transfer:${transferId}`;
  return q.add('export', { transferId }, {
    jobId,
    removeOnComplete: true,
    attempts: opts.attempts ?? 5,
    backoff: { type: 'exponential', delay: 1000 },
  });
}

export default { enqueueTransferExport };

