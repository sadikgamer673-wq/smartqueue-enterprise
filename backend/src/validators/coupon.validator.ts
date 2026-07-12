import { z } from 'zod';

export const createCouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  description: z.string().min(5),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive(),
  minOrderAmount: z.number().min(0).default(0),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().default(-1),
  expiresAt: z.string().refine((d) => !isNaN(Date.parse(d)), { message: 'Invalid date' }),
});
