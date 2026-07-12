import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getWorkerProfile,
  getWorkerDashboard,
  getAllWorkers,
  createWorker,
  toggleWorkerStatus,
} from '../controllers/worker.controller';

const router = Router();

router.get('/profile', authenticate, authorize('worker'), getWorkerProfile);
router.get('/dashboard', authenticate, authorize('worker'), getWorkerDashboard);
router.get('/', authenticate, authorize('admin'), getAllWorkers);
router.post('/', authenticate, authorize('admin'), createWorker);
router.patch('/:id/toggle', authenticate, authorize('admin'), toggleWorkerStatus);

export default router;
