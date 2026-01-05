import express from 'express';
import upload from '../middleware/upload.js';
import { protectAdmin, requireRole } from '../middleware/adminAuth.js';
import {
  listContent,
  getContent,
  createContent,
  updateContent,
  deleteContent,
  uploadImage,
} from '../controllers/ContentController.js';

const router = express.Router();

// Public
router.get('/', listContent);
router.get('/:id', getContent);

// Admin (protected + role)
router.post('/upload', protectAdmin, requireRole('Content Editor'), upload.single('file'), uploadImage);
router.post('/', protectAdmin, requireRole('Content Editor'), createContent);
router.put('/:id', protectAdmin, requireRole('Content Editor'), updateContent);
router.delete('/:id', protectAdmin, requireRole('Content Editor'), deleteContent);

export default router;
