import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { getStores, getStoreById, createStore, updateStore } from '../controllers/store.controller';

const router = Router();

router.get('/', getStores);
router.get('/:id', getStoreById);
router.post('/', authenticate, authorize('admin'), createStore);
router.put('/:id', authenticate, authorize('admin'), updateStore);

export default router;
