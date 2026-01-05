import express from 'express';
import { receiveWebhook } from '../../controllers/admin/FifaWebhooksController.js';

const router = express.Router();

// Webhooks are typically unauthenticated but should include a shared secret/header
router.post('/', receiveWebhook);

export default router;
