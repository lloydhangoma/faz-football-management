// services/backupService.js
import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs';
import Settings from '../models/Settings.js';

const execPromise = util.promisify(exec);
const mkdirPromise = util.promisify(fs.mkdir);
const writeFilePromise = util.promisify(fs.writeFile);

export const backupDatabase = async () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups');
    const backupFile = path.join(backupDir, `backup-${timestamp}.gz`);

    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      await mkdirPromise(backupDir);
    }

    // Run mongodump command
    const { stdout, stderr } = await execPromise(
      `mongodump --uri="${process.env.MONGO_URI}" --archive=${backupFile} --gzip`
    );

    // Update settings with last backup time
    await Settings.findOneAndUpdate(
      {},
      { lastBackup: new Date() },
      { upsert: true }
    );

    return {
      success: true,
      file: backupFile,
      size: fs.statSync(backupFile).size,
      timestamp: new Date()
    };
  } catch (err) {
    console.error('Backup error:', err);
    throw err;
  }
};