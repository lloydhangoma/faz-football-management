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
  uploadTransferDocuments,
} from '../../controllers/club/TransfersController.js';
import { protectAdmin } from '../../middleware/Clubs-AdminPortal-Auth.js';
import { injectClubId } from '../../middleware/clubOwnerAuth.js';
import upload from '../../middleware/upload.js';

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

// Upload transfer-scoped documents (consent, contract)
router.post('/:transferId/documents', upload.fields([
  { name: 'consent' },
  { name: 'contract' },
]), uploadTransferDocuments);

export default router;
