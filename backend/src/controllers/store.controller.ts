import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { Store } from '../models/Store.model';
import { storeRepository } from '../repositories/store.repository';
import { AppError } from '../utils/AppError';

export const getStores = catchAsync(async (req: Request, res: Response) => {
  const stores = await storeRepository.findAllActive();
  sendSuccess(res, stores, 'Stores fetched');
});

export const getStoreById = catchAsync(async (req: Request, res: Response) => {
  const store = await Store.findById(req.params.id);
  if (!store) throw new AppError('Store not found', 404);
  sendSuccess(res, store, 'Store fetched');
});

export const createStore = catchAsync(async (req: Request, res: Response) => {
  const existing = await storeRepository.findByCode(req.body.code);
  if (existing) throw new AppError('Store code already exists', 409);
  const store = await Store.create(req.body);
  sendSuccess(res, store, 'Store created', 201);
});

export const updateStore = catchAsync(async (req: Request, res: Response) => {
  const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!store) throw new AppError('Store not found', 404);
  sendSuccess(res, store, 'Store updated');
});
