import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { workerRepository } from '../repositories/worker.repository';
import { Worker } from '../models/Worker.model';
import { Order } from '../models/Order.model';
import { AppError } from '../utils/AppError';

export const getWorkerProfile = catchAsync(async (req: Request, res: Response) => {
  const worker = await Worker.findById(req.user!.userId).populate('storeId', 'name code address');
  if (!worker) throw new AppError('Worker not found', 404);
  sendSuccess(res, worker, 'Profile fetched');
});

export const getWorkerDashboard = catchAsync(async (req: Request, res: Response) => {
  const worker = await Worker.findById(req.user!.userId);
  if (!worker) throw new AppError('Worker not found', 404);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [pendingOrders, todayScans] = await Promise.all([
    Order.countDocuments({ storeId: worker.storeId, status: 'processing' }),
    Order.countDocuments({
      storeId: worker.storeId,
      'workerVerification.workerId': worker._id,
      'workerVerification.verifiedAt': { $gte: today },
    }),
  ]);

  sendSuccess(res, {
    worker: {
      name: worker.name,
      employeeId: worker.employeeId,
      totalScans: worker.totalScans,
      totalApprovals: worker.totalApprovals,
      totalRejections: worker.totalRejections,
    },
    pendingOrders,
    todayScans,
  }, 'Dashboard data fetched');
});

export const getAllWorkers = catchAsync(async (req: Request, res: Response) => {
  const { page = '1', limit = '20', storeId, search } = req.query;
  const result = await workerRepository.getAllPaginated(+page, +limit, storeId as string, search as string);
  sendSuccess(res, result, 'Workers fetched');
});

export const createWorker = catchAsync(async (req: Request, res: Response) => {
  const existing = await Worker.findOne({ email: req.body.email });
  if (existing) throw new AppError('Email already registered', 409);
  const worker = await Worker.create(req.body);
  sendSuccess(res, worker, 'Worker created', 201);
});

export const toggleWorkerStatus = catchAsync(async (req: Request, res: Response) => {
  const worker = await Worker.findByIdAndUpdate(
    req.params.id,
    [{ $set: { isActive: { $not: '$isActive' } } }],
    { new: true }
  );
  if (!worker) throw new AppError('Worker not found', 404);
  sendSuccess(res, worker, `Worker ${worker.isActive ? 'activated' : 'deactivated'}`);
});
