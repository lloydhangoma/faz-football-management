// routes/AdminPortalLoginRoutes.js
import express from 'express';
import {
  loginAdmin,
  checkAdminAuth,
  logoutAdmin,
  getAdmins,
  createAdmin,
  updateAdminById,
  deleteAdmin,
} from '../controllers/AdminPortalLoginController.js';
import { protectAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/admin-login', loginAdmin);
router.get('/admin-check-auth', checkAdminAuth);
router.post('/admin-logout', logoutAdmin);

router.get('/admins', protectAdmin, getAdmins);
router.post('/admins', protectAdmin, createAdmin);
router.put('/admins/:id', protectAdmin, updateAdminById);
router.delete('/admins/:id', protectAdmin, deleteAdmin);

export default router;
