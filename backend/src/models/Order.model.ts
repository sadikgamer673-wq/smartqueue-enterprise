import mongoose, { Document, Schema } from 'mongoose';

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'verified' | 'completed' | 'cancelled' | 'refunded';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  barcode: string;
  image: string;
  price: number;
  mrp: number;
  quantity: number;
  tax: number;
  total: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  couponId?: mongoose.Types.ObjectId;
  couponDiscount: number;
  total: number;
  status: OrderStatus;
  paymentId?: mongoose.Types.ObjectId;
  qrCodeId?: mongoose.Types.ObjectId;
  workerVerification?: {
    workerId: mongoose.Types.ObjectId;
    verifiedAt: Date;
    action: 'approved' | 'rejected';
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  barcode: String,
  image: String,
  price: Number,
  mrp: Number,
  quantity: Number,
  tax: Number,
  total: Number,
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  totalTax: { type: Number, default: 0 },
  totalDiscount: { type: Number, default: 0 },
  couponId: { type: Schema.Types.ObjectId, ref: 'Coupon' },
  couponDiscount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'verified', 'completed', 'cancelled', 'refunded'],
    default: 'pending',
  },
  paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
  qrCodeId: { type: Schema.Types.ObjectId, ref: 'QRCode' },
  workerVerification: {
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker' },
    verifiedAt: Date,
    action: { type: String, enum: ['approved', 'rejected'] },
    notes: String,
  },
}, { timestamps: true });

OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ storeId: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
