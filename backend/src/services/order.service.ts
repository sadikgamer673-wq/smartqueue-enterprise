import mongoose from 'mongoose';
import { Order } from '../models/Order.model';
import { Cart } from '../models/Cart.model';
import { Inventory } from '../models/Inventory.model';
import { Coupon } from '../models/Coupon.model';
import { orderRepository } from '../repositories/order.repository';
import { inventoryRepository } from '../repositories/inventory.repository';
import { AppError } from '../utils/AppError';
import { generateOrderNumber } from '../utils/orderNumber';
import { OrderStatus } from '../models/Order.model';

export class OrderService {
  async createFromCart(userId: string, storeId: string): Promise<any> {
    const cart = await Cart.findOne({ userId, storeId }).populate('items.productId');
    if (!cart || cart.items.length === 0) throw new AppError('Cart is empty', 400);

    // Reserve inventory for all items
    for (const item of cart.items) {
      const reserved = await inventoryRepository.reserveStock(
        item.productId.toString(),
        storeId,
        item.quantity
      );
      if (!reserved) throw new AppError(`Insufficient stock for ${item.name}`, 400);
    }

    const orderItems = cart.items.map((i) => ({
      productId: i.productId,
      name: i.name,
      barcode: i.barcode,
      image: i.image,
      price: i.price,
      mrp: i.mrp,
      quantity: i.quantity,
      tax: i.tax,
      total: parseFloat((i.price * i.quantity).toFixed(2)),
    }));

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: new mongoose.Types.ObjectId(userId),
      storeId: new mongoose.Types.ObjectId(storeId),
      items: orderItems,
      subtotal: cart.subtotal,
      totalTax: cart.totalTax,
      totalDiscount: cart.totalDiscount,
      couponId: cart.couponId,
      couponDiscount: cart.couponDiscount,
      total: cart.total,
      status: 'pending',
    });

    // Increment coupon usage
    if (cart.couponId) {
      await Coupon.findByIdAndUpdate(cart.couponId, { $inc: { usedCount: 1 } });
    }

    return order;
  }

  async getMyOrders(userId: string, page: number, limit: number) {
    return orderRepository.findByUser(userId, page, limit);
  }

  async getOrderDetail(orderId: string, userId: string): Promise<any> {
    const order = await Order.findOne({ _id: orderId, userId })
      .populate('storeId', 'name code address phone')
      .populate('paymentId')
      .exec();
    if (!order) throw new AppError('Order not found', 404);
    return order;
  }

  async cancelOrder(orderId: string, userId: string): Promise<any> {
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) throw new AppError('Order not found', 404);
    if (!['pending', 'paid'].includes(order.status)) {
      throw new AppError('Order cannot be cancelled at this stage', 400);
    }

    // Release reserved inventory
    for (const item of order.items) {
      await inventoryRepository.releaseReserved(
        item.productId.toString(),
        order.storeId.toString(),
        item.quantity
      );
    }

    order.status = 'cancelled';
    await order.save();
    return order;
  }

  async getAllAdmin(page: number, limit: number, status?: OrderStatus, storeId?: string) {
    return orderRepository.findAllAdmin(page, limit, status, storeId);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<any> {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) throw new AppError('Order not found', 404);
    return order;
  }
}

export const orderService = new OrderService();
