import mongoose, { Document, Schema } from 'mongoose';

export interface IStore extends Document {
  name: string;
  code: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  phone: string;
  email: string;
  isActive: boolean;
  taxRate: number;
  logo?: string;
  openingHours: {
    open: string;
    close: string;
  };
}

const StoreSchema = new Schema<IStore>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  taxRate: { type: Number, default: 18, min: 0, max: 100 },
  logo: { type: String },
  openingHours: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '22:00' },
  },
}, { timestamps: true });

export const Store = mongoose.model<IStore>('Store', StoreSchema);
