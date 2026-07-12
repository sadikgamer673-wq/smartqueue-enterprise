import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { qrService } from '../services/qr.service';

export const generateQR = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await qrService.generateQR(orderId, req.user!.userId);
  sendSuccess(res, result, 'QR code generated');
});

export const validateQR = catchAsync(async (req: Request, res: Response) => {
  const { encryptedData } = req.body;
  const result = await qrService.validateQR(encryptedData, req.user!.userId, req.user!.storeId!);
  sendSuccess(res, result, result.message);
});

export const completeVerification = catchAsync(async (req: Request, res: Response) => {
  const { token, action, notes } = req.body;
  await qrService.completeVerification(token, req.user!.userId, action, notes);
  sendSuccess(res, null, `Exit ${action} successfully`);
});
