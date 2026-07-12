import mongoose, { Document, Schema } from 'mongoose';

export interface IInventory extends Document {
  productId: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  quantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
  lastRestocked: Date;
}

const InventorySchema = new Schema<IInventory>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  quantity: { type: Number, required: true, default: 0, min: 0 },
  reservedQuantity: { type: Number, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  lastRestocked: { type: Date, default: Date.now },
}, { timestamps: true });

InventorySchema.index({ productId: 1, storeId: 1 }, { unique: true });

export const Inventory = mongoose.model<IInventory>('Inventory', InventorySchema);
