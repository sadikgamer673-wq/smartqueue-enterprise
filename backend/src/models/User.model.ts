import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar?: string;
  role: 'customer';
  isVerified: boolean;
  isActive: boolean;
  storeId?: mongoose.Types.ObjectId;
  rewardPoints: number;
  walletBalance: number;
  refreshToken?: string;
  fcmToken?: string;
  comparePassword(password: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  avatar: { type: String },
  role: { type: String, default: 'customer', immutable: true },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store' },
  rewardPoints: { type: Number, default: 0, min: 0 },
  walletBalance: { type: Number, default: 0, min: 0 },
  refreshToken: { type: String, select: false },
  fcmToken: { type: String },
}, { timestamps: true });

UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

export const User = mongoose.model<IUser>('User', UserSchema);
