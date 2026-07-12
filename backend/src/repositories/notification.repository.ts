import { Notification, INotification } from '../models/Notification.model';
import { BaseRepository } from './base.repository';
import mongoose from 'mongoose';

class NotificationRepository extends BaseRepository<INotification> {
  constructor() {
    super(Notification);
  }

  async createNotification(data: {
    userId: string;
    userModel: 'User' | 'Worker' | 'Admin';
    title: string;
    body: string;
    type: string;
    data?: Record<string, unknown>;
  }): Promise<INotification> {
    return Notification.create({
      ...data,
      userId: new mongoose.Types.ObjectId(data.userId),
    });
  }

  async getForUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const filter = { userId: new mongoose.Types.ObjectId(userId) };
    const [notifications, total, unread] = await Promise.all([
      Notification.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      Notification.countDocuments(filter).exec(),
      Notification.countDocuments({ ...filter, isRead: false }).exec(),
    ]);
    return { notifications, total, unread, page, limit, pages: Math.ceil(total / limit) };
  }

  async markRead(notificationId: string, userId: string): Promise<INotification | null> {
    return Notification.findOneAndUpdate(
      { _id: notificationId, userId: new mongoose.Types.ObjectId(userId) },
      { isRead: true, readAt: new Date() },
      { new: true }
    ).exec();
  }

  async markAllRead(userId: string): Promise<void> {
    await Notification.updateMany(
      { userId: new mongoose.Types.ObjectId(userId), isRead: false },
      { isRead: true, readAt: new Date() }
    ).exec();
  }
}

export const notificationRepository = new NotificationRepository();
