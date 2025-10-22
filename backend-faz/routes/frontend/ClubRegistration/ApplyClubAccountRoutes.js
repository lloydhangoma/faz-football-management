// routes/frontend/ClubRegistration/ApplyClubAccountRoutes.js

import express from 'express';
import multer from 'multer';
import {
  create, list, counts, getOne, download, updateStatus,remove,
} from '../../../controllers/frontend/ClubRegistration/ApplyClubAccountController.js';

// memory storage → files go as buffers into Mongo
const storage = multer.memoryStorage();

const MAX_FILE_MB = parseInt(process.env.FILE_MAX_MB || '5', 10); // default 5MB
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_MB * 1024 * 1024, files: 12 },
  fileFilter: (req, file, cb) => {
    const ok = new Set([
      'application/pdf',
      'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml',
    ]);
    if (!ok.has(file.mimetype)) {
      return cb(Object.assign(new Error('UNSUPPORTED_FILE_TYPE'), { code: 'LIMIT_FILE_TYPE' }));
    }
    cb(null, true);
  },
});

const router = express.Router();

// If you have admin auth, protect list/status/download like this:
// const requireAdmin = (req, res, next) => next(); // TODO: implement
// router.use(requireAdmin) for GET/patch except POST create, etc.

// Public create (club submits app)
const fields = upload.fields([
  { name: 'constitution', maxCount: 1 },
  { name: 'clubLicense',  maxCount: 1 },
  { name: 'contactId',    maxCount: 1 },
  { name: 'supporting',   maxCount: 10 },
]);
router.post('/', fields, create);

// Admin endpoints
router.get('/', list);
router.get('/_counts', counts);
router.get('/:id', getOne);

// ✅ Split into two plain routes (no optional, no regex pattern)
router.get('/:id/download/:kind', download);        // e.g. /123/download/constitution
router.get('/:id/download/:kind/:index', download); // e.g. /123/download/supporting/0

router.patch('/:id/status', express.json(), updateStatus);
router.delete('/:id', remove);

export default router;
