import { Router } from 'express';
import {
  getRestaurants, getRestaurant, getFeatured, getPopularDishes,
  createRestaurant, updateRestaurant, deleteRestaurant,
} from '../controllers/restaurantController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/', getRestaurants);
router.get('/featured', getFeatured);
router.get('/popular-dishes', getPopularDishes);
router.get('/:id', getRestaurant);

router.use(protect, restrictTo('admin', 'restaurant'));
router.post('/', createRestaurant);
router.patch('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);

export default router;
