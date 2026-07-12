import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  barcode: z.string().min(1),
  sku: z.string().min(1),
  categoryId: z.string().min(1),
  brand: z.string().min(1),
  price: z.number().positive(),
  mrp: z.number().positive(),
  tax: z.number().min(0).max(100).default(0),
  unit: z.string().default('piece'),
  storeId: z.string().min(1),
  images: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  initialStock: z.number().min(0).optional().default(0),
  lowStockThreshold: z.number().min(0).optional().default(10),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  mrp: z.number().positive().optional(),
  tax: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});
