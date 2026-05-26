import { Router } from 'express';
import {
  register, login, logout, getMe, updateProfile,
  forgotPassword, resetPassword, addAddress, toggleFavorite,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

router.use(protect);
router.get('/me', getMe);
router.patch('/profile', updateProfile);
router.post('/addresses', addAddress);
router.post('/favorites/:restaurantId', toggleFavorite);

export default router;
