import { Worker, IWorker } from '../models/Worker.model';
import { BaseRepository } from './base.repository';

class WorkerRepository extends BaseRepository<IWorker> {
  constructor() {
    super(Worker);
  }

  async findByEmail(email: string): Promise<IWorker | null> {
    return Worker.findOne({ email: email.toLowerCase() }).exec();
  }

  async findByStore(storeId: string): Promise<IWorker[]> {
    return Worker.find({ storeId, isActive: true }).exec();
  }

  async incrementScans(workerId: string, action: 'approved' | 'rejected'): Promise<void> {
    const inc: any = { totalScans: 1 };
    if (action === 'approved') inc.totalApprovals = 1;
    else inc.totalRejections = 1;
    await Worker.findByIdAndUpdate(workerId, { $inc: inc }).exec();
  }

  async getAllPaginated(page = 1, limit = 20, storeId?: string, search?: string) {
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (storeId) filter.storeId = storeId;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }
    const [workers, total] = await Promise.all([
      Worker.find(filter)
        .populate('storeId', 'name code')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      Worker.countDocuments(filter).exec(),
    ]);
    return { workers, total, page, limit, pages: Math.ceil(total / limit) };
  }
}

export const workerRepository = new WorkerRepository();
