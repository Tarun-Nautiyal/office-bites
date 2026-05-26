import { Router } from 'express';
import {
  createMenuItem, updateMenuItem, deleteMenuItem, getMenuByRestaurant,
} from '../controllers/menuController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/restaurant/:restaurantId', getMenuByRestaurant);

router.use(protect, restrictTo('admin', 'restaurant'));
router.post('/', createMenuItem);
router.post('/restaurant/:restaurantId', createMenuItem);
router.patch('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);

export default router;
