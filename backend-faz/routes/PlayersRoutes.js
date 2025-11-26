import express from 'express';
import {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  updatePlayerStatus,
  addPlayerMovement,
} from '../controllers/PlayersController.js';
import { protectAdmin } from '../middleware/Clubs-AdminPortal-Auth.js';
import { injectClubId } from '../middleware/clubOwnerAuth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All player routes require authentication and club owner verification
router.use(protectAdmin, injectClubId);

// Player list and creation
router.get('/', getPlayers);
// Accept multipart/form-data for player creation and updates (files: avatar, birthCertificate, medicalClearance, educationCertificate, parentalConsent, passport, workPermit)
router.post('/', upload.fields([
  { name: 'avatar' },
  { name: 'birthCertificate' },
  { name: 'medicalClearance' },
  { name: 'educationCertificate' },
  { name: 'parentalConsent' },
  { name: 'passport' },
  { name: 'workPermit' },
]), createPlayer);

// Individual player operations
router.get('/:playerId', getPlayerById);
router.put('/:playerId', upload.fields([
  { name: 'avatar' },
  { name: 'birthCertificate' },
  { name: 'medicalClearance' },
  { name: 'educationCertificate' },
  { name: 'parentalConsent' },
  { name: 'passport' },
  { name: 'workPermit' },
]), updatePlayer);
router.delete('/:playerId', deletePlayer);

// Player-specific operations
router.put('/:playerId/status', updatePlayerStatus);
router.post('/:playerId/movement', addPlayerMovement);

export default router;
