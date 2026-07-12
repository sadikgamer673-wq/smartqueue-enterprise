import { User, IUser } from '../models/User.model';
import { BaseRepository } from './base.repository';

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() }).exec();
  }

  async findByPhone(phone: string): Promise<IUser | null> {
    return User.findOne({ phone }).exec();
  }

  async updateWallet(userId: string, amount: number): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      { $inc: { walletBalance: amount } },
      { new: true }
    ).exec();
  }

  async addRewardPoints(userId: string, points: number): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      { $inc: { rewardPoints: points } },
      { new: true }
    ).exec();
  }

  async getAllPaginated(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      User.countDocuments(filter).exec(),
    ]);
    return { users, total, page, limit, pages: Math.ceil(total / limit) };
  }
}

export const userRepository = new UserRepository();
