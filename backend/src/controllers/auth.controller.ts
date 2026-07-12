import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { authService } from '../services/auth.service';

export const registerCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerCustomer(req.body);
  sendSuccess(res, result, 'Registration successful', 201);
});

export const loginCustomer = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginCustomer(email, password);
  sendSuccess(res, result, 'Login successful');
});

export const loginWorker = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginWorker(email, password);
  sendSuccess(res, result, 'Login successful');
});

export const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginAdmin(email, password);
  sendSuccess(res, result, 'Login successful');
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshAccessToken(refreshToken);
  sendSuccess(res, result, 'Token refreshed');
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.user!.userId, req.user!.role);
  sendSuccess(res, null, 'Logged out successfully');
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  sendSuccess(res, req.user, 'User info');
});
