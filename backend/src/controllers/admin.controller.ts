import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { userRepository } from '../repositories/user.repository';
import { User } from '../models/User.model';
import { Admin } from '../models/Admin.model';
import { AppError } from '../utils/AppError';

export const getAdminProfile = catchAsync(async (req: Request, res: Response) => {
  const admin = await Admin.findById(req.user!.userId);
  if (!admin) throw new AppError('Admin not found', 404);
  sendSuccess(res, admin, 'Profile fetched');
});

export const getAllCustomers = catchAsync(async (req: Request, res: Response) => {
  const { page = '1', limit = '20', search } = req.query;
  const result = await userRepository.getAllPaginated(+page, +limit, search as string);
  sendSuccess(res, result, 'Customers fetched');
});

export const getCustomerById = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('Customer not found', 404);
  sendSuccess(res, user, 'Customer fetched');
});

export const toggleCustomerStatus = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    [{ $set: { isActive: { $not: '$isActive' } } }],
    { new: true }
  );
  if (!user) throw new AppError('Customer not found', 404);
  sendSuccess(res, user, `Customer ${user.isActive ? 'activated' : 'deactivated'}`);
});
