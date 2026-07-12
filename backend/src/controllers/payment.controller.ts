import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { paymentService } from '../services/payment.service';

export const createPaymentOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.body;
  const result = await paymentService.createOrder(orderId, req.user!.userId);
  sendSuccess(res, result, 'Payment order created');
});

export const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  await paymentService.verifyPayment({ ...req.body, userId: req.user!.userId });
  sendSuccess(res, null, 'Payment verified successfully');
});
