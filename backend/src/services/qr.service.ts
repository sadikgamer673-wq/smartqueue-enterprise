import QRCode from 'qrcode';
import { QRCode as QRCodeModel } from '../models/QRCode.model';
import { Order } from '../models/Order.model';
import { FraudLog } from '../models/FraudLog.model';
import { encrypt, decrypt, generateToken } from '../utils/qrCrypto';
import { AppError } from '../utils/AppError';
import { emitToUser } from '../config/socket';
import mongoose from 'mongoose';

interface QRPayload {
  orderId: string;
  userId: string;
  storeId: string;
  orderNumber: string;
  total: number;
  itemCount: number;
  timestamp: number;
}

export class QRService {
  async generateQR(orderId: string, userId: string): Promise<{ qrImage: string; token: string; expiresAt: Date }> {
    const order = await Order.findById(orderId).populate('userId');
    if (!order) throw new AppError('Order not found', 404);
    
    const orderUserId = (order.userId as any)._id ? (order.userId as any)._id.toString() : order.userId.toString();
    if (orderUserId !== userId) throw new AppError('Unauthorized', 403);
    if (order.status !== 'paid') throw new AppError('Order must be paid before generating QR', 400);

    // Check if QR already exists
    const existing = await QRCodeModel.findOne({ orderId });
    if (existing && !existing.isUsed && existing.expiresAt > new Date()) {
      const qrImage = await QRCode.toDataURL(existing.encryptedData);
      return { qrImage, token: existing.token, expiresAt: existing.expiresAt };
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const payload: QRPayload = {
      orderId: order.id,
      userId,
      storeId: order.storeId.toString(),
      orderNumber: order.orderNumber,
      total: order.total,
      itemCount: order.items.reduce((acc, item) => acc + item.quantity, 0),
      timestamp: Date.now(),
    };

    const encryptedData = encrypt(JSON.stringify({ token, payload }));
    const qrImage = await QRCode.toDataURL(encryptedData, {
      errorCorrectionLevel: 'H',
      width: 400,
      margin: 2,
    });

    await QRCodeModel.findOneAndUpdate(
      { orderId },
      { orderId, userId, storeId: order.storeId, token, encryptedData, isUsed: false, expiresAt },
      { upsert: true, new: true }
    );

    await Order.findByIdAndUpdate(orderId, { status: 'processing' });

    return { qrImage, token, expiresAt };
  }

  async validateQR(encryptedData: string, workerId: string, storeId: string): Promise<{
    valid: boolean;
    order: any;
    message: string;
  }> {
    let decrypted: { token: string; payload: QRPayload };

    try {
      decrypted = JSON.parse(decrypt(encryptedData));
    } catch {
      await this.logFraud(null, null, storeId, workerId, 'invalid_qr', 'QR data could not be decrypted');
      return { valid: false, order: null, message: 'Invalid QR code' };
    }

    const qrRecord = await QRCodeModel.findOne({ token: decrypted.token });

    if (!qrRecord) {
      await this.logFraud(decrypted.payload?.orderId, decrypted.payload?.userId, storeId, workerId, 'invalid_qr', 'QR token not found in database');
      return { valid: false, order: null, message: 'QR code not found' };
    }

    if (qrRecord.isUsed) {
      await this.logFraud(qrRecord.orderId.toString(), qrRecord.userId.toString(), storeId, workerId, 'used_qr', 'Attempt to reuse already-scanned QR');
      return { valid: false, order: null, message: 'QR code has already been used' };
    }

    if (qrRecord.expiresAt < new Date()) {
      await this.logFraud(qrRecord.orderId.toString(), qrRecord.userId.toString(), storeId, workerId, 'expired_qr', 'QR code expired');
      return { valid: false, order: null, message: 'QR code has expired' };
    }

    if (qrRecord.storeId.toString() !== storeId) {
      await this.logFraud(qrRecord.orderId.toString(), qrRecord.userId.toString(), storeId, workerId, 'invalid_qr', 'QR used at wrong store');
      return { valid: false, order: null, message: 'QR code is not valid for this store' };
    }

    const order = await Order.findById(qrRecord.orderId).populate('items.productId').lean();
    if (!order || order.status !== 'processing') {
      return { valid: false, order: null, message: 'Order is not in a valid state' };
    }

    return { valid: true, order, message: 'QR code is valid' };
  }

  async completeVerification(token: string, workerId: string, action: 'approved' | 'rejected', notes?: string): Promise<void> {
    const qrRecord = await QRCodeModel.findOne({ token });
    if (!qrRecord) throw new AppError('QR record not found', 404);

    // Mark QR as used
    await QRCodeModel.findByIdAndUpdate(qrRecord._id, {
      isUsed: true,
      usedAt: new Date(),
      usedByWorkerId: workerId,
    });

    const newStatus = action === 'approved' ? 'completed' : 'verified';

    await Order.findByIdAndUpdate(qrRecord.orderId, {
      status: newStatus,
      workerVerification: {
        workerId: new mongoose.Types.ObjectId(workerId),
        verifiedAt: new Date(),
        action,
        notes,
      },
    });

    // Notify customer in real-time
    emitToUser(qrRecord.userId.toString(), 'order:verified', {
      orderId: qrRecord.orderId,
      action,
      message: action === 'approved' ? 'Exit approved! Thank you for shopping.' : 'Exit rejected. Please contact store staff.',
    });
  }

  private async logFraud(
    orderId: string | null,
    userId: string | null,
    storeId: string,
    workerId: string,
    type: any,
    description: string
  ): Promise<void> {
    try {
      await FraudLog.create({
        orderId: orderId ? new mongoose.Types.ObjectId(orderId) : undefined,
        userId: userId ? new mongoose.Types.ObjectId(userId) : new mongoose.Types.ObjectId(),
        workerId: new mongoose.Types.ObjectId(workerId),
        storeId: new mongoose.Types.ObjectId(storeId),
        type,
        description,
        severity: 'high',
      });
    } catch { /* silent */ }
  }
}

export const qrService = new QRService();
