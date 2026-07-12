import mongoose, { Document, Schema } from 'mongoose';

export interface IQRCode extends Document {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  token: string;
  encryptedData: string;
  qrImageUrl?: string;
  isUsed: boolean;
  usedAt?: Date;
  usedByWorkerId?: mongoose.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

const QRCodeSchema = new Schema<IQRCode>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  token: { type: String, required: true, unique: true },
  encryptedData: { type: String, required: true },
  qrImageUrl: String,
  isUsed: { type: Boolean, default: false },
  usedAt: Date,
  usedByWorkerId: { type: Schema.Types.ObjectId, ref: 'Worker' },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

QRCodeSchema.index({ token: 1 });
QRCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const QRCode = mongoose.model<IQRCode>('QRCode', QRCodeSchema);
