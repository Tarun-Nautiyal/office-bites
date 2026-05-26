import { Router } from 'express';
import {
  createOrder, getMyOrders, getOrder, updateOrderStatus,
  validatePromo, getRestaurantOrders,
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.post('/validate-promo', validatePromo);
router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/restaurant/:restaurantId', restrictTo('admin', 'restaurant'), getRestaurantOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', restrictTo('admin', 'restaurant'), updateOrderStatus);

export default router;
