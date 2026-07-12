import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { Coupon } from '../models/Coupon.model';
import { couponRepository } from '../repositories/coupon.repository';
import { AppError } from '../utils/AppError';

export const getCoupons = catchAsync(async (req: Request, res: Response) => {
  const { page = '1', limit = '20' } = req.query;
  const result = await couponRepository.getAllPaginated(+page, +limit);
  sendSuccess(res, result, 'Coupons fetched');
});

export const getCouponByCode = catchAsync(async (req: Request, res: Response) => {
  const coupon = await couponRepository.findByCode(req.params.code);
  if (!coupon) throw new AppError('Coupon not found or inactive', 404);
  sendSuccess(res, coupon, 'Coupon fetched');
});

export const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const existing = await Coupon.findOne({ code: req.body.code?.toUpperCase() });
  if (existing) throw new AppError('Coupon code already exists', 409);
  const coupon = await Coupon.create(req.body);
  sendSuccess(res, coupon, 'Coupon created', 201);
});

export const toggleCoupon = catchAsync(async (req: Request, res: Response) => {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    [{ $set: { isActive: { $not: '$isActive' } } }],
    { new: true }
  );
  if (!coupon) throw new AppError('Coupon not found', 404);
  sendSuccess(res, coupon, `Coupon ${coupon.isActive ? 'activated' : 'deactivated'}`);
});

export const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new AppError('Coupon not found', 404);
  sendSuccess(res, null, 'Coupon deleted');
});
