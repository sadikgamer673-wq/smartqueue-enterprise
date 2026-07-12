import { Category, ICategory } from '../models/Category.model';
import { BaseRepository } from './base.repository';

class CategoryRepository extends BaseRepository<ICategory> {
  constructor() {
    super(Category);
  }

  async findTree(): Promise<ICategory[]> {
    return Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).exec();
  }

  async findRootCategories(): Promise<ICategory[]> {
    return Category.find({ parentId: null, isActive: true }).sort({ sortOrder: 1 }).exec();
  }

  async findBySlug(slug: string): Promise<ICategory | null> {
    return Category.findOne({ slug }).exec();
  }
}

export const categoryRepository = new CategoryRepository();
