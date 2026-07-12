import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { Category } from '../models/Category.model';
import { categoryRepository } from '../repositories/category.repository';
import { AppError } from '../utils/AppError';
import { slugify } from '../utils/slugify';

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await categoryRepository.findTree();
  sendSuccess(res, categories, 'Categories fetched');
});

export const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError('Category not found', 404);
  sendSuccess(res, category, 'Category fetched');
});

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const slug = slugify(req.body.name);
  const category = await Category.create({ ...req.body, slug });
  sendSuccess(res, category, 'Category created', 201);
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) throw new AppError('Category not found', 404);
  sendSuccess(res, category, 'Category updated');
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!category) throw new AppError('Category not found', 404);
  sendSuccess(res, null, 'Category deleted');
});
