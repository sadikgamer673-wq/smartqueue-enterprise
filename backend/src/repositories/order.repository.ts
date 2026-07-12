import { Order, IOrder, OrderStatus } from '../models/Order.model';
import { BaseRepository } from './base.repository';

class OrderRepository extends BaseRepository<IOrder> {
  constructor() {
    super(Order);
  }

  async findByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find({ userId })
        .populate('storeId', 'name code address')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      Order.countDocuments({ userId }).exec(),
    ]);
    return { orders, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findByStore(storeId: string, page = 1, limit = 20, status?: OrderStatus) {
    const skip = (page - 1) * limit;
    const filter: any = { storeId };
    if (status) filter.status = status;
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('userId', 'name email phone')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      Order.countDocuments(filter).exec(),
    ]);
    return { orders, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findAllAdmin(page = 1, limit = 20, status?: OrderStatus, storeId?: string) {
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (status) filter.status = status;
    if (storeId) filter.storeId = storeId;
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('userId', 'name email')
        .populate('storeId', 'name code')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      Order.countDocuments(filter).exec(),
    ]);
    return { orders, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(orderId, { status }, { new: true }).exec();
  }

  async getRevenueStats(storeId?: string, from?: Date, to?: Date) {
    const match: any = { status: { $in: ['completed', 'paid'] } };
    if (storeId) match.storeId = storeId;
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = from;
      if (to) match.createdAt.$lte = to;
    }
    return Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}

export const orderRepository = new OrderRepository();
