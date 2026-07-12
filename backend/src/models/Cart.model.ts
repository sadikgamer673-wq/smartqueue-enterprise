import mongoose, { Document, Schema } from 'mongoose';

interface ICartItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  mrp: number;
  quantity: number;
  tax: number;
  barcode: string;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  items: ICartItem[];
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  couponId?: mongoose.Types.ObjectId;
  couponDiscount: number;
  total: number;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  tax: { type: Number, default: 0 },
  barcode: String,
}, { _id: false });

const CartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  items: [CartItemSchema],
  subtotal: { type: Number, default: 0 },
  totalTax: { type: Number, default: 0 },
  totalDiscount: { type: Number, default: 0 },
  couponId: { type: Schema.Types.ObjectId, ref: 'Coupon' },
  couponDiscount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
}, { timestamps: true });

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
