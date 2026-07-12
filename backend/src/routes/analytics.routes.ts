import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getDashboardStats,
  getRevenueChart,
  getTopProducts,
  getOrderStatusBreakdown,
} from '../controllers/analytics.controller';

const router = Router();

router.get('/dashboard', authenticate, authorize('admin'), getDashboardStats);
router.get('/revenue', authenticate, authorize('admin'), getRevenueChart);
router.get('/top-products', authenticate, authorize('admin'), getTopProducts);
router.get('/order-status', authenticate, authorize('admin'), getOrderStatusBreakdown);

export default router;
