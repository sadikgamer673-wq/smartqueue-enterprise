import { User, IUser } from '../models/User.model';
import { Worker } from '../models/Worker.model';
import { Admin } from '../models/Admin.model';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../config/jwt';
import { AppError } from '../utils/AppError';
import { IAuthResponse, ITokenPayload } from '../types/auth.types';

export class AuthService {
  async registerCustomer(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<IAuthResponse> {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new AppError('Email already registered', 409);

    const user = await User.create(data);
    return this.generateAuthResponse(user.id, 'customer', user);
  }

  async loginCustomer(email: string, password: string): Promise<IAuthResponse> {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }
    if (!user.isActive) throw new AppError('Account is deactivated', 403);

    const tokens = this.generateAuthResponse(user.id, 'customer', user);
    await User.findByIdAndUpdate(user.id, { refreshToken: tokens.refreshToken });
    return tokens;
  }

  async loginWorker(email: string, password: string): Promise<IAuthResponse> {
    const worker = await Worker.findOne({ email }).select('+password');
    if (!worker || !(await worker.comparePassword(password))) {
      throw new AppError('Invalid credentials', 401);
    }
    if (!worker.isActive) throw new AppError('Account is deactivated', 403);

    const tokens = this.generateAuthResponse(worker.id, 'worker', worker, worker.storeId.toString());
    await Worker.findByIdAndUpdate(worker.id, { refreshToken: tokens.refreshToken });
    return tokens;
  }

  async loginAdmin(email: string, password: string): Promise<IAuthResponse> {
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
      throw new AppError('Invalid credentials', 401);
    }
    if (!admin.isActive) throw new AppError('Account is deactivated', 403);

    const tokens = this.generateAuthResponse(admin.id, 'admin', admin);
    await Admin.findByIdAndUpdate(admin.id, { refreshToken: tokens.refreshToken });
    return tokens;
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    let payload: ITokenPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    let userRecord: any;
    if (payload.role === 'customer') {
      userRecord = await User.findById(payload.userId).select('+refreshToken');
    } else if (payload.role === 'worker') {
      userRecord = await Worker.findById(payload.userId).select('+refreshToken');
    } else {
      userRecord = await Admin.findById(payload.userId).select('+refreshToken');
    }

    if (!userRecord || userRecord.refreshToken !== refreshToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    const accessToken = signAccessToken({
      userId: payload.userId,
      role: payload.role,
      storeId: payload.storeId,
    });

    return { accessToken };
  }

  async logout(userId: string, role: string): Promise<void> {
    if (role === 'customer') await User.findByIdAndUpdate(userId, { refreshToken: null });
    else if (role === 'worker') await Worker.findByIdAndUpdate(userId, { refreshToken: null });
    else await Admin.findByIdAndUpdate(userId, { refreshToken: null });
  }

  private generateAuthResponse(
    userId: string,
    role: 'customer' | 'worker' | 'admin',
    user: any,
    storeId?: string
  ): IAuthResponse {
    const payload: ITokenPayload = { userId, role, storeId };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role,
        avatar: user.avatar,
      },
    };
  }
}

export const authService = new AuthService();
