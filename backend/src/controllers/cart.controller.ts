import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { cartService } from '../services/cart.service';

export const getCart = catchAsync(async (req: Request, res: Response) => {
  const cart = await cartService.getCart(req.user!.userId);
  sendSuccess(res, cart, 'Cart retrieved');
});

export const addToCart = catchAsync(async (req: Request, res: Response) => {
  const { productId, quantity, storeId } = req.body;
  const cart = await cartService.addItem(req.user!.userId, storeId, productId, quantity);
  sendSuccess(res, cart, 'Item added to cart');
});

export const updateCartItem = catchAsync(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.updateItem(req.user!.userId, productId, quantity);
  sendSuccess(res, cart, 'Cart updated');
});

export const clearCart = catchAsync(async (req: Request, res: Response) => {
  await cartService.clearCart(req.user!.userId);
  sendSuccess(res, null, 'Cart cleared');
});

export const applyCoupon = catchAsync(async (req: Request, res: Response) => {
  const { code } = req.body;
  const cart = await cartService.applyCoupon(req.user!.userId, code);
  sendSuccess(res, cart, 'Coupon applied');
});
