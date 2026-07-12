import { Product, IProduct } from '../models/Product.model';
import { BaseRepository } from './base.repository';

class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(Product);
  }

  async findByBarcode(barcode: string, storeId: string): Promise<IProduct | null> {
    return Product.findOne({ barcode, storeId, isActive: true })
      .populate('categoryId', 'name slug')
      .exec();
  }

  async findByStore(storeId: string, page = 1, limit = 20, categoryId?: string, search?: string) {
    const skip = (page - 1) * limit;
    const filter: any = { storeId, isActive: true };
    if (categoryId) filter.categoryId = categoryId;
    if (search) filter.$text = { $search: search };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('categoryId', 'name slug')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      Product.countDocuments(filter).exec(),
    ]);
    return { products, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findAllAdmin(page = 1, limit = 20, search?: string, storeId?: string) {
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (storeId) filter.storeId = storeId;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('categoryId', 'name')
        .populate('storeId', 'name code')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      Product.countDocuments(filter).exec(),
    ]);
    return { products, total, page, limit, pages: Math.ceil(total / limit) };
  }
}

export const productRepository = new ProductRepository();
