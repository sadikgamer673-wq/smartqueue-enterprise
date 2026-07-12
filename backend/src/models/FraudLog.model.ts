import mongoose, { Document, Schema } from 'mongoose';

export interface IFraudLog extends Document {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  workerId?: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  type: 'invalid_qr' | 'expired_qr' | 'used_qr' | 'item_mismatch' | 'payment_failure' | 'suspicious_activity';
  description: string;
  metadata?: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
  resolvedBy?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
}

const FraudLogSchema = new Schema<IFraudLog>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  workerId: { type: Schema.Types.ObjectId, ref: 'Worker' },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  type: { type: String, enum: ['invalid_qr', 'expired_qr', 'used_qr', 'item_mismatch', 'payment_failure', 'suspicious_activity'], required: true },
  description: { type: String, required: true },
  metadata: Schema.Types.Mixed,
  severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  resolved: { type: Boolean, default: false },
  resolvedBy: { type: Schema.Types.ObjectId },
  resolvedAt: Date,
}, { timestamps: true });

export const FraudLog = mongoose.model<IFraudLog>('FraudLog', FraudLogSchema);
