import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  userModel: 'User' | 'Worker' | 'Admin';
  action: string;
  resource: string;
  resourceId?: mongoose.Types.ObjectId;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

const AuditLogSchema = new Schema<IAuditLog>({
  userId: { type: Schema.Types.ObjectId, required: true },
  userModel: { type: String, enum: ['User', 'Worker', 'Admin'] },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  resourceId: Schema.Types.ObjectId,
  changes: Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
}, { timestamps: true });

AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ resource: 1, resourceId: 1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
