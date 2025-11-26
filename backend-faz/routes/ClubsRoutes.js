import express from 'express';
import {
  getClubById,
  updateClub,
  getClubStats,
  getClubProfile,
} from '../controllers/ClubsController.js';
import { protectAdmin } from '../middleware/Clubs-AdminPortal-Auth.js';
import { clubOwnerCheck } from '../middleware/clubOwnerAuth.js';

const router = express.Router();

// All club routes require authentication and club owner verification
router.get('/:clubId', protectAdmin, clubOwnerCheck, getClubById);
router.put('/:clubId', protectAdmin, clubOwnerCheck, updateClub);
router.get('/:clubId/stats', protectAdmin, clubOwnerCheck, getClubStats);
router.get('/:clubId/profile', protectAdmin, clubOwnerCheck, getClubProfile);

export default router;
