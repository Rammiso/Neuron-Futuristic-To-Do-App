import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  logout
} from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { validate, schemas } from '../middlewares/validation.js';

const router = express.Router();

router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(schemas.updateProfile), updateProfile);
router.post('/logout', protect, logout);

export default router;
