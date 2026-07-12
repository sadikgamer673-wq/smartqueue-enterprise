import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IWorker extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  employeeId: string;
  storeId: mongoose.Types.ObjectId;
  role: 'worker';
  isActive: boolean;
  avatar?: string;
  totalScans: number;
  totalApprovals: number;
  totalRejections: number;
  refreshToken?: string;
  fcmToken?: string;
  comparePassword(password: string): Promise<boolean>;
}

const WorkerSchema = new Schema<IWorker>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  password: { type: String, required: true, select: false },
  employeeId: { type: String, required: true, unique: true },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  role: { type: String, default: 'worker', immutable: true },
  isActive: { type: Boolean, default: true },
  avatar: { type: String },
  totalScans: { type: Number, default: 0 },
  totalApprovals: { type: Number, default: 0 },
  totalRejections: { type: Number, default: 0 },
  refreshToken: { type: String, select: false },
  fcmToken: { type: String },
}, { timestamps: true });

WorkerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

WorkerSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const Worker = mongoose.model<IWorker>('Worker', WorkerSchema);
