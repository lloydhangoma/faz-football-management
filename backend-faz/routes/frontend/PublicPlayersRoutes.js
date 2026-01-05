import express from 'express';
import { getPublicPlayers, getPublicPlayerById } from '../../controllers/frontend/PlayersPublicController.js';

const router = express.Router();

// Public endpoints - no authentication required
router.get('/', getPublicPlayers);
router.get('/:id', getPublicPlayerById);

export default router;
