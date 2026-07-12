import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getMyNotifications, markRead, markAllRead } from '../controllers/notification.controller';

const router = Router();

router.get('/', authenticate, getMyNotifications);
router.patch('/read-all', authenticate, markAllRead);
router.patch('/:id/read', authenticate, markRead);

export default router;
