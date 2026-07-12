import crypto from 'crypto';
import { razorpay } from '../config/razorpay';
import { Payment } from '../models/Payment.model';
import { Order } from '../models/Order.model';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import mongoose from 'mongoose';

export class PaymentService {
  async createOrder(orderId: string, userId: string): Promise<{
    razorpayOrderId: string;
    amount: number;
    currency: string;
    key: string;
  }> {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);
    if (order.userId.toString() !== userId) throw new AppError('Unauthorized', 403);

    const amountInPaise = Math.round(order.total * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order.orderNumber,
      notes: { orderId: orderId, userId },
    });

    await Payment.create({
      orderId: new mongoose.Types.ObjectId(orderId),
      userId: new mongoose.Types.ObjectId(userId),
      razorpayOrderId: razorpayOrder.id,
      amount: order.total,
      currency: 'INR',
      status: 'created',
    });

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      key: env.RAZORPAY_KEY_ID,
    };
  }

  async verifyPayment(data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderId: string;
    userId: string;
  }): Promise<boolean> {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId, userId } = data;

    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const signatureBuffer = Buffer.from(razorpaySignature, 'utf8');

    if (
      expectedBuffer.length !== signatureBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
    ) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { status: 'failed', failureReason: 'Signature mismatch' }
      );
      throw new AppError('Payment verification failed', 400);
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: 'paid',
      },
      { new: true }
    );

    if (!payment) throw new AppError('Payment record not found', 404);

    await Order.findByIdAndUpdate(orderId, {
      status: 'paid',
      paymentId: payment._id,
    });

    return true;
  }

  async getPaymentByOrder(orderId: string, userId: string): Promise<any> {
    const payment = await Payment.findOne({ orderId, userId });
    if (!payment) throw new AppError('Payment not found', 404);
    return payment;
  }
}

export const paymentService = new PaymentService();
