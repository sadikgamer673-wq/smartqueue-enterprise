import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getProducts,
  getProductById,
  getProductByBarcode,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';

const router = Router();

router.get('/', getProducts);
router.get('/barcode/:barcode', authenticate, getProductByBarcode);
router.get('/:id', getProductById);
router.post('/', authenticate, authorize('admin'), createProduct);
router.put('/:id', authenticate, authorize('admin'), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

export default router;
