import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { getInventory, getLowStock, updateStock } from '../controllers/inventory.controller';

const router = Router();

router.get('/', authenticate, authorize('admin', 'worker'), getInventory);
router.get('/low-stock', authenticate, authorize('admin'), getLowStock);
router.patch('/update', authenticate, authorize('admin'), updateStock);

export default router;
