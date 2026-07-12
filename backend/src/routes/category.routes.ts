import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', authenticate, authorize('admin'), createCategory);
router.put('/:id', authenticate, authorize('admin'), updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategory);

export default router;
