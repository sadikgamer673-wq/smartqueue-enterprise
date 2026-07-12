import { z } from 'zod';

export const addItemSchema = z.object({
  productId: z.string().min(1, 'Product ID required'),
  storeId: z.string().min(1, 'Store ID required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const updateItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(0),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code required'),
});
