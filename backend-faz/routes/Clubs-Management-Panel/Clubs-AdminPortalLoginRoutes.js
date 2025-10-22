import express from 'express';
import multer from 'multer';
import {
  loginAdmin,
  checkAdminAuth,
  logoutAdmin,
  getAdmins,
  createAdmin,
  updateAdminById,
  deleteAdmin,
  registerClub, // ⬅️ make sure this is imported
} from '../../controllers/Clubs-Management-Panel/Clubs-AdminPortalLoginController.js';
import { protectAdmin } from '../../middleware/Clubs-AdminPortal-Auth.js';

const router = express.Router();

// Inline Multer config (or import from middleware/upload.js)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});

// public
router.post('/admin-login', loginAdmin);
router.get('/admin-check-auth', checkAdminAuth);
router.post('/admin-logout', logoutAdmin);

// ✅ registration (matches your frontend path)
router.post('/club/register', upload.single('clubLogo'), registerClub);

// protected
router.get('/admins', protectAdmin, getAdmins);
router.post('/admins', protectAdmin, createAdmin);
router.put('/admins/:id', protectAdmin, updateAdminById);
router.delete('/admins/:id', protectAdmin, deleteAdmin);

export default router;
