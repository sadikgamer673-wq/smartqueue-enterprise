import { Router } from 'express';
import { registerCustomer, loginCustomer, loginWorker, loginAdmin, refreshToken, logout, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new customer
 *     tags: [Auth]
 */
router.post('/register', registerCustomer);
router.post('/login/customer', loginCustomer);
router.post('/login/worker', loginWorker);
router.post('/login/admin', loginAdmin);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
