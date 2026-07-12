import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { getCoupons, getCouponByCode, createCoupon, toggleCoupon, deleteCoupon } from '../controllers/coupon.controller';

const router = Router();

router.get('/', authenticate, authorize('admin'), getCoupons);
router.get('/:code', authenticate, getCouponByCode);
router.post('/', authenticate, authorize('admin'), createCoupon);
router.patch('/:id/toggle', authenticate, authorize('admin'), toggleCoupon);
router.delete('/:id', authenticate, authorize('admin'), deleteCoupon);

export default router;
