import jwt from 'jsonwebtoken';
import { env } from './env';
import { ITokenPayload } from '../types/auth.types';

export const signAccessToken = (payload: ITokenPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);

export const signRefreshToken = (payload: ITokenPayload): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);

export const verifyAccessToken = (token: string): ITokenPayload =>
  jwt.verify(token, env.JWT_SECRET) as ITokenPayload;

export const verifyRefreshToken = (token: string): ITokenPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as ITokenPayload;
