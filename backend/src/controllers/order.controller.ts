import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { orderService } from '../services/order.service';
import { OrderStatus } from '../models/Order.model';

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { storeId } = req.body;
  const order = await orderService.createFromCart(req.user!.userId, storeId);
  sendSuccess(res, order, 'Order created', 201);
});

export const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const { page = '1', limit = '10' } = req.query;
  const result = await orderService.getMyOrders(req.user!.userId, +page, +limit);
  sendSuccess(res, result, 'Orders fetched');
});

export const getOrderDetail = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.getOrderDetail(req.params.id, req.user!.userId);
  sendSuccess(res, order, 'Order fetched');
});

export const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.cancelOrder(req.params.id, req.user!.userId);
  sendSuccess(res, order, 'Order cancelled');
});

export const getAllOrdersAdmin = catchAsync(async (req: Request, res: Response) => {
  const { page = '1', limit = '20', status, storeId } = req.query;
  const result = await orderService.getAllAdmin(+page, +limit, status as OrderStatus, storeId as string);
  sendSuccess(res, result, 'Orders fetched');
});

export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body;
  const order = await orderService.updateOrderStatus(req.params.id, status);
  sendSuccess(res, order, 'Order status updated');
});
