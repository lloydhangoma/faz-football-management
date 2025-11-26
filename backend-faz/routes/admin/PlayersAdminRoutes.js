import express from 'express';
import { protectAdmin } from '../../middleware/adminAuth.js';
import { requireRole } from '../../middleware/requireRole.js';
import {
  listPending,
  getById,
  approve,
  rejectPlayer,
} from '../../controllers/admin/PlayersAdminController.js';

const router = express.Router();

// All admin player routes require an authenticated admin and Super Admin role
router.use(protectAdmin);
router.use(requireRole('Super Admin'));

router.get('/pending', listPending);
router.get('/:id', getById);
router.post('/:id/approve', approve);
router.post('/:id/reject', rejectPlayer);

export default router;
