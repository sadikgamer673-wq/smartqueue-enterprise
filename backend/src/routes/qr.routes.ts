import { Router } from 'express';
import { generateQR, validateQR, completeVerification } from '../controllers/qr.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/generate/:orderId', authenticate, authorize('customer'), generateQR);
router.post('/validate', authenticate, authorize('worker'), validateQR);
router.post('/complete', authenticate, authorize('worker'), completeVerification);

export default router;
