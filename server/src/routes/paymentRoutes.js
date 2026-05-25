import { Router } from 'express';
import {
  createCheckoutSession, confirmDemoPayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.post('/checkout/:orderId', createCheckoutSession);
router.post('/confirm/:orderId', confirmDemoPayment);

export default router;
