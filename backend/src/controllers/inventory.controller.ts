import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { inventoryRepository } from '../repositories/inventory.repository';
import { Inventory } from '../models/Inventory.model';
import { AppError } from '../utils/AppError';
import { emitToAdmins } from '../config/socket';

export const getInventory = catchAsync(async (req: Request, res: Response) => {
  const { storeId, page = '1', limit = '20' } = req.query;
  if (!storeId) throw new AppError('storeId is required', 400);
  const result = await inventoryRepository.getByStore(storeId as string, +page, +limit);
  sendSuccess(res, result, 'Inventory fetched');
});

export const getLowStock = catchAsync(async (req: Request, res: Response) => {
  const { storeId } = req.query;
  const items = await inventoryRepository.getLowStock(storeId as string);
  sendSuccess(res, items, 'Low stock items fetched');
});

export const updateStock = catchAsync(async (req: Request, res: Response) => {
  const { productId, storeId, quantity, lowStockThreshold } = req.body;
  const inventory = await Inventory.findOneAndUpdate(
    { productId, storeId },
    {
      ...(quantity !== undefined && { quantity }),
      ...(lowStockThreshold !== undefined && { lowStockThreshold }),
      lastRestocked: new Date(),
    },
    { new: true, upsert: true }
  );
  // Emit low stock alert if needed
  if (inventory.quantity <= inventory.lowStockThreshold) {
    emitToAdmins('inventory:low', { productId, storeId, quantity: inventory.quantity });
  }
  sendSuccess(res, inventory, 'Stock updated');
});

export const deductMockStock = catchAsync(async (req: Request, res: Response) => {
  const { items, storeId } = req.body;
  if (!items || !Array.isArray(items)) {
    throw new AppError('items array is required', 400);
  }

  // Find the first store as a fallback if storeId is not provided
  const targetStore = await require('../models/Store.model').Store.findOne();
  const realStoreId = targetStore ? targetStore._id.toString() : storeId;

  for (const item of items) {
    const productId = item.productId || item._id;
    if (productId && !productId.startsWith('prod_')) { // Avoid local mock product strings
      await inventoryRepository.deductStock(productId.toString(), realStoreId, item.quantity || 1);
    }
  }
  sendSuccess(res, null, 'Stock deducted successfully');
});
