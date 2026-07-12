import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { productService } from '../services/product.service';

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const { storeId, page = '1', limit = '20', categoryId, search } = req.query;
  if (!storeId) {
    const result = await productService.getAllAdmin(+page, +limit, search as string);
    return sendSuccess(res, result, 'Products fetched');
  }
  const result = await productService.getProducts(storeId as string, +page, +limit, categoryId as string, search as string);
  sendSuccess(res, result, 'Products fetched');
});

export const getProductById = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getById(req.params.id);
  sendSuccess(res, product, 'Product fetched');
});

export const getProductByBarcode = catchAsync(async (req: Request, res: Response) => {
  const { barcode } = req.params;
  const storeId = req.query.storeId as string;
  const product = await productService.getByBarcode(barcode, storeId);
  sendSuccess(res, product, 'Product fetched');
});

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  sendSuccess(res, product, 'Product created', 201);
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  sendSuccess(res, product, 'Product updated');
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await productService.deleteProduct(req.params.id);
  sendSuccess(res, null, 'Product deactivated');
});
