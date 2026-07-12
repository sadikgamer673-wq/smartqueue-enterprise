import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { analyticsService } from '../services/analytics.service';

export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const { storeId } = req.query;
  const stats = await analyticsService.getDashboardStats(storeId as string);
  sendSuccess(res, stats, 'Dashboard stats fetched');
});

export const getRevenueChart = catchAsync(async (req: Request, res: Response) => {
  const { days = '30', storeId } = req.query;
  const data = await analyticsService.getRevenueChart(+days, storeId as string);
  sendSuccess(res, data, 'Revenue chart data fetched');
});

export const getTopProducts = catchAsync(async (req: Request, res: Response) => {
  const { limit = '10', storeId } = req.query;
  const data = await analyticsService.getTopProducts(+limit, storeId as string);
  sendSuccess(res, data, 'Top products fetched');
});

export const getOrderStatusBreakdown = catchAsync(async (req: Request, res: Response) => {
  const { storeId } = req.query;
  const data = await analyticsService.getOrderStatusBreakdown(storeId as string);
  sendSuccess(res, data, 'Order status breakdown fetched');
});
