import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types/common.types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  pagination?: PaginationMeta
): void => {
  const response: ApiResponse<T> = { success: true, message, data };
  if (pagination) response.pagination = pagination;
  res.status(statusCode).json(response);
};

export const sendError = (res: Response, message: string, statusCode = 500): void => {
  res.status(statusCode).json({ success: false, message });
};

export const paginate = (total: number, page: number, limit: number): PaginationMeta => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNext: page < Math.ceil(total / limit),
  hasPrev: page > 1,
});
