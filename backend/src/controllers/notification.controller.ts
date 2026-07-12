import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { notificationService } from '../services/notification.service';

export const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const { page = '1', limit = '20' } = req.query;
  const result = await notificationService.getMyNotifications(req.user!.userId, +page, +limit);
  sendSuccess(res, result, 'Notifications fetched');
});

export const markRead = catchAsync(async (req: Request, res: Response) => {
  const notification = await notificationService.markRead(req.params.id, req.user!.userId);
  sendSuccess(res, notification, 'Notification marked as read');
});

export const markAllRead = catchAsync(async (req: Request, res: Response) => {
  await notificationService.markAllRead(req.user!.userId);
  sendSuccess(res, null, 'All notifications marked as read');
});
