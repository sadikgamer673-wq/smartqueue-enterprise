import { Router } from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/payment.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate, authorize('customer'));

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);

export default router;
