import { Product } from '../models/Product.model';
import { Inventory } from '../models/Inventory.model';
import { productRepository } from '../repositories/product.repository';
import { inventoryRepository } from '../repositories/inventory.repository';
import { AppError } from '../utils/AppError';
import { slugify } from '../utils/slugify';
import mongoose from 'mongoose';

export class ProductService {
  async getProducts(storeId: string, page: number, limit: number, categoryId?: string, search?: string) {
    return productRepository.findByStore(storeId, page, limit, categoryId, search);
  }

  async getAllAdmin(page: number, limit: number, search?: string, storeId?: string, categoryId?: string) {
    return productRepository.findAllAdmin(page, limit, search, storeId, categoryId);
  }

  async getById(id: string): Promise<any> {
    const product = await Product.findById(id)
      .populate('categoryId', 'name slug')
      .populate('storeId', 'name code')
      .exec();
    if (!product) throw new AppError('Product not found', 404);
    return product;
  }

  async getByBarcode(barcode: string, storeId?: string): Promise<any> {
    const product = await productRepository.findByBarcode(barcode, storeId);
    if (!product) throw new AppError('Product not found for this barcode', 404);

    const targetStoreId = storeId || product.storeId.toString();
    const inventory = await inventoryRepository.findByProduct(product.id, targetStoreId);
    return {
      ...product.toObject(),
      availableQuantity: (inventory?.quantity ?? 0) - (inventory?.reservedQuantity ?? 0),
      stockStatus: inventory ? (inventory.quantity <= inventory.lowStockThreshold ? 'low' : 'available') : 'out_of_stock',
    };
  }

  async createProduct(data: any): Promise<any> {
    const slug = slugify(data.name) + '-' + Date.now();
    const existing = await Product.findOne({ barcode: data.barcode, storeId: data.storeId });
    if (existing) throw new AppError('A product with this barcode already exists in this store', 409);

    const product = await Product.create({ ...data, slug });

    // Create inventory record
    await Inventory.create({
      productId: product._id,
      storeId: data.storeId,
      quantity: data.initialStock ?? 0,
      lowStockThreshold: data.lowStockThreshold ?? 10,
    });

    return product;
  }

  async updateProduct(id: string, data: any): Promise<any> {
    const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!product) throw new AppError('Product not found', 404);
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!product) throw new AppError('Product not found', 404);
  }
}

export const productService = new ProductService();
