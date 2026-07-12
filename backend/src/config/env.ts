import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  API_VERSION: z.string().default('v1'),
  MONGODB_URI: z.string().min(1),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Encryption (for QR codes)
  ENCRYPTION_KEY: z.string().length(32),
  ENCRYPTION_IV: z.string().length(16),

  // Razorpay (optional in dev)
  RAZORPAY_KEY_ID: isDev ? z.string().default('rzp_test_placeholder') : z.string().min(1),
  RAZORPAY_KEY_SECRET: isDev ? z.string().default('placeholder_secret') : z.string().min(1),

  // Cloudinary (optional in dev)
  CLOUDINARY_CLOUD_NAME: isDev ? z.string().default('dev_cloud') : z.string().min(1),
  CLOUDINARY_API_KEY: isDev ? z.string().default('000000000000000') : z.string().min(1),
  CLOUDINARY_API_SECRET: isDev ? z.string().default('dev_secret') : z.string().min(1),

  // Redis (optional)
  REDIS_URL: z.string().default('redis://localhost:6379'),

  // Email (optional in dev)
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: isDev ? z.string().default('dev@smartqueue.com') : z.string().min(1),
  SMTP_PASS: isDev ? z.string().default('dev_pass') : z.string().min(1),
  EMAIL_FROM: z.string().default('SmartQueue <noreply@smartqueue.com>'),

  // Client URLs
  CLIENT_URL: z.string().default('http://localhost:3000'),
  ADMIN_URL: z.string().default('http://localhost:3001'),
  WORKER_URL: z.string().default('http://localhost:19007'),
  EXPO_WEB_URL: z.string().default('http://localhost:19006'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
