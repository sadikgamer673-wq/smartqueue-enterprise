import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  userModel: 'User' | 'Worker' | 'Admin';
  title: string;
  body: string;
  type: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, required: true, refPath: 'userModel' },
  userModel: { type: String, enum: ['User', 'Worker', 'Admin'], required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  isRead: { type: Boolean, default: false },
  readAt: Date,
}, { timestamps: true });

NotificationSchema.index({ userId: 1, isRead: 1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
