import { Order } from '../models/Order.model';
import { User } from '../models/User.model';
import { Product } from '../models/Product.model';
import { Payment } from '../models/Payment.model';
import { orderRepository } from '../repositories/order.repository';

export class AnalyticsService {
  async getDashboardStats(storeId?: string) {
    const matchFilter: any = {};
    if (storeId) matchFilter.storeId = storeId;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalOrders,
      todayOrders,
      monthOrders,
      totalRevenue,
      todayRevenue,
      monthRevenue,
      totalCustomers,
      totalProducts,
      pendingOrders,
    ] = await Promise.all([
      Order.countDocuments({ ...matchFilter, status: { $in: ['completed', 'paid'] } }),
      Order.countDocuments({ ...matchFilter, status: { $in: ['completed', 'paid'] }, createdAt: { $gte: startOfToday } }),
      Order.countDocuments({ ...matchFilter, status: { $in: ['completed', 'paid'] }, createdAt: { $gte: startOfMonth } }),
      Order.aggregate([{ $match: { ...matchFilter, status: { $in: ['completed', 'paid'] } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.aggregate([{ $match: { ...matchFilter, status: { $in: ['completed', 'paid'] }, createdAt: { $gte: startOfToday } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.aggregate([{ $match: { ...matchFilter, status: { $in: ['completed', 'paid'] }, createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      User.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments({ ...matchFilter, status: 'pending' }),
    ]);

    return {
      orders: { total: totalOrders, today: todayOrders, thisMonth: monthOrders, pending: pendingOrders },
      revenue: {
        total: totalRevenue[0]?.total ?? 0,
        today: todayRevenue[0]?.total ?? 0,
        thisMonth: monthRevenue[0]?.total ?? 0,
      },
      customers: { total: totalCustomers },
      products: { total: totalProducts },
    };
  }

  async getRevenueChart(days = 30, storeId?: string) {
    const from = new Date();
    from.setDate(from.getDate() - days);
    return orderRepository.getRevenueStats(storeId, from);
  }

  async getTopProducts(limit = 10, storeId?: string) {
    const match: any = { status: { $in: ['completed', 'paid'] } };
    if (storeId) match.storeId = storeId;
    return Order.aggregate([
      { $match: match },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: limit },
    ]);
  }

  async getOrderStatusBreakdown(storeId?: string) {
    const match: any = {};
    if (storeId) match.storeId = storeId;
    return Order.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
  }
}

export const analyticsService = new AnalyticsService();
