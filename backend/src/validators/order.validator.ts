import { z } from 'zod';

export const createOrderSchema = z.object({
  storeId: z.string().min(1, 'Store ID is required'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'processing', 'verified', 'completed', 'cancelled', 'refunded']),
});
