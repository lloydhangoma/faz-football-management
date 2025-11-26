import express from 'express';
import {
  getTransfers,
  getTransferById,
  createTransfer,
  acceptTransfer,
  rejectTransfer,
  createCounterOffer,
  acceptCounterOffer,
  cancelTransfer,
} from '../controllers/TransfersController.js';
import { protectAdmin } from '../middleware/Clubs-AdminPortal-Auth.js';
import { injectClubId } from '../middleware/clubOwnerAuth.js';

const router = express.Router();

// All transfer routes require authentication
router.use(protectAdmin, injectClubId);

// Transfer list and creation
router.get('/', getTransfers);
router.post('/', createTransfer);

// Individual transfer operations
router.get('/:transferId', getTransferById);
router.put('/:transferId/accept', acceptTransfer);
router.put('/:transferId/reject', rejectTransfer);
router.delete('/:transferId', cancelTransfer);

// Counter offers
router.post('/:transferId/counter-offer', createCounterOffer);
router.put('/:transferId/counter-offer/:offerId/accept', acceptCounterOffer);

export default router;
