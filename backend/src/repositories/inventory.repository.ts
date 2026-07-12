import { Inventory, IInventory } from '../models/Inventory.model';
import { BaseRepository } from './base.repository';

class InventoryRepository extends BaseRepository<IInventory> {
  constructor() {
    super(Inventory);
  }

  async findByProduct(productId: string, storeId: string): Promise<IInventory | null> {
    return Inventory.findOne({ productId, storeId }).exec();
  }

  async getLowStock(storeId?: string, threshold?: number) {
    const filter: any = {};
    if (storeId) filter.storeId = storeId;
    return Inventory.find({
      ...filter,
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] },
    })
      .populate('productId', 'name barcode sku images')
      .populate('storeId', 'name code')
      .exec();
  }

  async reserveStock(productId: string, storeId: string, qty: number): Promise<boolean> {
    const result = await Inventory.findOneAndUpdate(
      {
        productId,
        storeId,
        $expr: { $gte: [{ $subtract: ['$quantity', '$reservedQuantity'] }, qty] },
      },
      { $inc: { reservedQuantity: qty } },
      { new: true }
    ).exec();
    return !!result;
  }

  async releaseReserved(productId: string, storeId: string, qty: number): Promise<void> {
    await Inventory.findOneAndUpdate(
      { productId, storeId },
      { $inc: { reservedQuantity: -qty } }
    ).exec();
  }

  async deductStock(productId: string, storeId: string, qty: number): Promise<void> {
    await Inventory.findOneAndUpdate(
      { productId, storeId },
      { $inc: { quantity: -qty, reservedQuantity: -qty } }
    ).exec();
  }

  async getByStore(storeId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Inventory.find({ storeId })
        .populate('productId', 'name barcode sku images price')
        .skip(skip)
        .limit(limit)
        .exec(),
      Inventory.countDocuments({ storeId }).exec(),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }
}

export const inventoryRepository = new InventoryRepository();
