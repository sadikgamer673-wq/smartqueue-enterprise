import mongoose from 'mongoose';
import { Cart } from '../models/Cart.model';
import { Product } from '../models/Product.model';
import { Store } from '../models/Store.model';
import { Category } from '../models/Category.model';
import { Inventory } from '../models/Inventory.model';
import { cartService } from '../services/cart.service';

describe('CartService Integration Tests', () => {
  let storeId: string;
  let productId: string;
  const userId = new mongoose.Types.ObjectId().toString();

  beforeAll(async () => {
    // Create seed data for testing
    const store = await Store.create({
      name: 'Test Store',
      code: 'TSTSTORE',
      address: { street: 'Street', city: 'City', state: 'State', pincode: '111111' },
      phone: '1234567890',
      email: 'test@store.com',
      taxRate: 18,
    });
    storeId = store._id.toString();

    const category = await Category.create({
      name: 'Test Category',
      slug: 'test-cat',
    });

    const product = await Product.create({
      name: 'Test Product',
      slug: 'test-product',
      description: 'A test product description',
      barcode: '1234567890123',
      sku: 'TSTPROD1',
      brand: 'TestBrand',
      price: 100,
      mrp: 120,
      tax: 18,
      storeId: store._id,
      categoryId: category._id,
      images: [],
    });
    productId = product._id.toString();

    // Create inventory record
    await Inventory.create({
      productId: product._id,
      storeId: store._id,
      quantity: 10,
      lowStockThreshold: 2,
    });
  });

  afterAll(async () => {
    await Store.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Inventory.deleteMany({});
    await Cart.deleteMany({});
  });

  it('should add a product to the cart', async () => {
    const cart = await cartService.addItem(userId, storeId, productId, 2);
    expect(cart).toBeDefined();
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].productId.toString()).toBe(productId);
    expect(cart.items[0].quantity).toBe(2);
    expect(cart.subtotal).toBe(200);
  });

  it('should update the product quantity in the cart', async () => {
    const cart = await cartService.updateItem(userId, productId, 5);
    expect(cart.items[0].quantity).toBe(5);
    expect(cart.subtotal).toBe(500);
  });

  it('should retrieve the cart for a user', async () => {
    const cart = await cartService.getCart(userId);
    expect(cart).toBeDefined();
    expect(cart.items.length).toBe(1);
    expect(cart.subtotal).toBe(500);
  });

  it('should clear the cart for a user', async () => {
    await cartService.clearCart(userId);
    const cart = await Cart.findOne({ userId });
    expect(cart).toBeNull();
  });
});
