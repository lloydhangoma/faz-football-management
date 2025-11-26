import express from 'express';
import {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  updateMatchScore,
  deleteMatch,
} from '../controllers/MatchesController.js';
import { protectAdmin } from '../middleware/Clubs-AdminPortal-Auth.js';
import { injectClubId } from '../middleware/clubOwnerAuth.js';

const router = express.Router();

// All match routes require authentication
router.use(protectAdmin, injectClubId);

// Match list and creation
router.get('/', getMatches);
router.post('/', createMatch);

// Individual match operations
router.get('/:matchId', getMatchById);
router.put('/:matchId', updateMatch);
router.put('/:matchId/score', updateMatchScore);
router.delete('/:matchId', deleteMatch);

export default router;
