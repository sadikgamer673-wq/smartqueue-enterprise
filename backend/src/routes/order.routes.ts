import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  createOrder,
  getMyOrders,
  getOrderDetail,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatus,
} from '../controllers/order.controller';

const router = Router();

router.post('/', authenticate, authorize('customer'), createOrder);
router.get('/my', authenticate, authorize('customer'), getMyOrders);
router.get('/admin', authenticate, authorize('admin'), getAllOrdersAdmin);
router.get('/:id', authenticate, getOrderDetail);
router.patch('/:id/cancel', authenticate, authorize('customer'), cancelOrder);
router.patch('/:id/status', authenticate, authorize('admin'), updateOrderStatus);

export default router;
