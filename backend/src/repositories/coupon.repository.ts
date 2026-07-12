import { Coupon, ICoupon } from '../models/Coupon.model';
import { BaseRepository } from './base.repository';

class CouponRepository extends BaseRepository<ICoupon> {
  constructor() {
    super(Coupon);
  }

  async findByCode(code: string): Promise<ICoupon | null> {
    return Coupon.findOne({ code: code.toUpperCase(), isActive: true }).exec();
  }

  async incrementUsage(couponId: string): Promise<void> {
    await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } }).exec();
  }

  async getAllPaginated(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [coupons, total] = await Promise.all([
      Coupon.find().skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      Coupon.countDocuments().exec(),
    ]);
    return { coupons, total, page, limit, pages: Math.ceil(total / limit) };
  }
}

export const couponRepository = new CouponRepository();
