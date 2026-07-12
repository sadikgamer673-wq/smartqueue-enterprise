import { Router } from 'express';
import { getCart, addToCart, updateCartItem, clearCart, applyCoupon } from '../controllers/cart.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate, authorize('customer'));

router.get('/', getCart);
router.post('/items', addToCart);
router.patch('/items', updateCartItem);
router.delete('/clear', clearCart);
router.post('/coupon', applyCoupon);

export default router;
