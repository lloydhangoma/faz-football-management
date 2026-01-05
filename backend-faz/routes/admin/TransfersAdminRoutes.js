import express from 'express';
import { protectAdmin } from '../../middleware/adminAuth.js';
import { requireRole } from '../../middleware/requireRole.js';
import {
  listPending,
  getById,
  approveTransfer,
  rejectTransfer,
  triggerExport,
} from '../../controllers/admin/TransfersAdminController.js';

const router = express.Router();

router.use(protectAdmin);
router.use(requireRole('Super Admin'));

router.get('/pending', listPending);
router.get('/:id', getById);
router.post('/:id/approve', approveTransfer);
router.post('/:id/reject', rejectTransfer);
router.post('/:id/trigger-export', triggerExport);

export default router;
