import { Router } from 'express';
import {
  getDashboardStats, getAllUsers, getAllOrders, createReview, getReviews,
} from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/reviews/:restaurantId', getReviews);
router.post('/reviews', protect, createReview);

router.use(protect, restrictTo('admin', 'restaurant'));
router.get('/stats', getDashboardStats);
router.get('/users', restrictTo('admin'), getAllUsers);
router.get('/orders', getAllOrders);

export default router;
