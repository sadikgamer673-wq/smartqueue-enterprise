import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  barcode: string;
  sku: string;
  categoryId: mongoose.Types.ObjectId;
  brand: string;
  images: string[];
  price: number;
  mrp: number;
  discountPercent: number;
  tax: number;
  unit: string;
  weight?: number;
  storeId: mongoose.Types.ObjectId;
  isActive: boolean;
  tags: string[];
  nutritionInfo?: Record<string, string>;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, index: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  barcode: { type: String, required: true, index: true },
  sku: { type: String, required: true, unique: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, required: true },
  images: [{ type: String }],
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, required: true, min: 0 },
  discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  tax: { type: Number, default: 0, min: 0 },
  unit: { type: String, required: true, default: 'piece' },
  weight: Number,
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  isActive: { type: Boolean, default: true },
  tags: [String],
  nutritionInfo: { type: Schema.Types.Mixed },
}, { timestamps: true });

ProductSchema.index({ barcode: 1, storeId: 1 }, { unique: true });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
