import mongoose from 'mongoose';
import { Cart } from '../models/Cart.model';
import { Product } from '../models/Product.model';
import { Inventory } from '../models/Inventory.model';
import { Coupon } from '../models/Coupon.model';
import { AppError } from '../utils/AppError';

export class CartService {
  async getCart(userId: string): Promise<any> {
    let cart = await Cart.findOne({ userId }).populate('items.productId', 'name images price isActive');
    if (!cart) return { items: [], subtotal: 0, total: 0, totalTax: 0, totalDiscount: 0, couponDiscount: 0 };
    return cart;
  }

  async addItem(userId: string, storeId: string, productId: string, quantity: number): Promise<any> {
    const product = await Product.findOne({ _id: productId, storeId, isActive: true });
    if (!product) throw new AppError('Product not found', 404);

    const inventory = await Inventory.findOne({ productId, storeId });
    const availableQty = (inventory?.quantity ?? 0) - (inventory?.reservedQuantity ?? 0);
    if (availableQty < quantity) throw new AppError(`Only ${availableQty} items available`, 400);

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, storeId, items: [] });
    }

    const existingIdx = cart.items.findIndex((i) => i.productId.toString() === productId);

    if (existingIdx >= 0) {
      const newQty = cart.items[existingIdx].quantity + quantity;
      if (newQty > availableQty) throw new AppError(`Only ${availableQty} items available`, 400);
      cart.items[existingIdx].quantity = newQty;
    } else {
      cart.items.push({
        productId: new mongoose.Types.ObjectId(productId),
        name: product.name,
        image: product.images[0] || '',
        price: product.price,
        mrp: product.mrp,
        quantity,
        tax: product.tax,
        barcode: product.barcode,
      });
    }

    this.recalculate(cart);
    await cart.save();
    return cart;
  }

  async updateItem(userId: string, productId: string, quantity: number): Promise<any> {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new AppError('Cart not found', 404);

    if (quantity === 0) {
      cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    } else {
      const idx = cart.items.findIndex((i) => i.productId.toString() === productId);
      if (idx < 0) throw new AppError('Item not in cart', 404);
      cart.items[idx].quantity = quantity;
    }

    this.recalculate(cart);
    await cart.save();
    return cart;
  }

  async clearCart(userId: string): Promise<void> {
    await Cart.findOneAndDelete({ userId });
  }

  async applyCoupon(userId: string, code: string): Promise<any> {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new AppError('Cart is empty', 400);

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) throw new AppError('Invalid coupon code', 400);
    if (coupon.expiresAt < new Date()) throw new AppError('Coupon has expired', 400);
    if (coupon.usageLimit !== -1 && coupon.usedCount >= coupon.usageLimit) {
      throw new AppError('Coupon usage limit reached', 400);
    }
    if (cart.subtotal < coupon.minOrderAmount) {
      throw new AppError(`Minimum order amount ₹${coupon.minOrderAmount} required`, 400);
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (cart.subtotal * coupon.value) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.value;
    }

    cart.couponId = coupon._id as mongoose.Types.ObjectId;
    cart.couponDiscount = discount;
    cart.total = Math.max(0, cart.subtotal + cart.totalTax - cart.totalDiscount - discount);
    await cart.save();
    return cart;
  }

  private recalculate(cart: any): void {
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    for (const item of cart.items) {
      const itemTotal = item.price * item.quantity;
      const mrpTotal = item.mrp * item.quantity;
      const taxAmount = (itemTotal * item.tax) / 100;
      subtotal += itemTotal;
      totalTax += taxAmount;
      totalDiscount += mrpTotal - itemTotal;
    }

    cart.subtotal = parseFloat(subtotal.toFixed(2));
    cart.totalTax = parseFloat(totalTax.toFixed(2));
    cart.totalDiscount = parseFloat(totalDiscount.toFixed(2));
    cart.total = parseFloat((subtotal + totalTax - cart.couponDiscount).toFixed(2));
  }
}

export const cartService = new CartService();
