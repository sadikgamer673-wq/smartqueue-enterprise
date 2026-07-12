import { notificationRepository } from '../repositories/notification.repository';
import { emitToUser } from '../config/socket';

export class NotificationService {
  async send(data: {
    userId: string;
    userModel: 'User' | 'Worker' | 'Admin';
    title: string;
    body: string;
    type: string;
    data?: Record<string, unknown>;
  }) {
    const notification = await notificationRepository.createNotification(data);
    // Real-time push via Socket.IO
    emitToUser(data.userId, 'notification:new', {
      id: notification.id,
      title: notification.title,
      body: notification.body,
      type: notification.type,
      data: notification.data,
      createdAt: notification.createdAt,
    });
    return notification;
  }

  async getMyNotifications(userId: string, page: number, limit: number) {
    return notificationRepository.getForUser(userId, page, limit);
  }

  async markRead(notificationId: string, userId: string) {
    return notificationRepository.markRead(notificationId, userId);
  }

  async markAllRead(userId: string) {
    return notificationRepository.markAllRead(userId);
  }
}

export const notificationService = new NotificationService();
