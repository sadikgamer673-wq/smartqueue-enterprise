import { Store, IStore } from '../models/Store.model';
import { BaseRepository } from './base.repository';

class StoreRepository extends BaseRepository<IStore> {
  constructor() {
    super(Store);
  }

  async findByCode(code: string): Promise<IStore | null> {
    return Store.findOne({ code: code.toUpperCase() }).exec();
  }

  async findAllActive(): Promise<IStore[]> {
    return Store.find({ isActive: true }).sort({ name: 1 }).exec();
  }
}

export const storeRepository = new StoreRepository();
