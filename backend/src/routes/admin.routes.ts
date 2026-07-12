import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getAdminProfile,
  getAllCustomers,
  getCustomerById,
  toggleCustomerStatus,
} from '../controllers/admin.controller';

const router = Router();

router.get('/profile', authenticate, authorize('admin'), getAdminProfile);
router.get('/customers', authenticate, authorize('admin'), getAllCustomers);
router.get('/customers/:id', authenticate, authorize('admin'), getCustomerById);
router.patch('/customers/:id/toggle', authenticate, authorize('admin'), toggleCustomerStatus);

export default router;
