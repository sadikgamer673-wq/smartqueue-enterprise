# SmartQueue Enterprise

An AI-powered mobile self-checkout ecosystem that eliminates traditional billing queues in supermarkets and shopping malls.

## Applications

| App | Stack | Description |
|-----|-------|-------------|
| `backend/` | Node.js + Express + TypeScript + MongoDB | REST API, Socket.IO, QR service |
| `customer-mobile/` | React Native + Expo + TypeScript | Customer scanning & payment app |
| `worker-mobile/` | React Native + Expo + TypeScript | Worker QR verification app |
| `admin-dashboard/` | React + Vite + TypeScript + MUI | Admin management dashboard |

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose
- MongoDB Atlas account
- Razorpay account
- Cloudinary account

### 1. Clone & Install
```bash
git clone <repo-url>
cd SmartQueue-Enterprise
pnpm install
```

### 2. Configure Environment
```bash
cp backend/.env.example backend/.env
# Fill in your credentials
```

### 3. Run with Docker
```bash
docker-compose up -d
```

### 4. Or run individually
```bash
# Backend
cd backend && pnpm dev

# Admin Dashboard
cd admin-dashboard && pnpm dev

# Customer App
cd customer-mobile && pnpm start

# Worker App
cd worker-mobile && pnpm start
```

## Architecture

```
Customer App  ──┐
Worker App    ──┼──► Backend API ──► MongoDB Atlas
Admin Dashboard─┘         │
                      Socket.IO
                      Razorpay
                      Cloudinary
                      Nodemailer
```

## Shopping Flow

1. Customer logs in → selects store
2. Scans product barcodes → items added to cart
3. Applies coupons → pays via Razorpay
4. Backend verifies payment → generates encrypted one-time QR
5. Worker scans QR → verifies items → approves exit
6. QR invalidated → order complete

## User Roles

- **Customer** — scan, pay, receive QR, view history
- **Worker** — scan QR, verify items, approve/reject exit
- **Admin** — manage products, inventory, workers, analytics

## Tech Stack

### Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT + Refresh Tokens
- Socket.IO (real-time)
- Razorpay (payments)
- Cloudinary (images)
- Nodemailer (emails)
- Winston (logging)
- Zod (validation)
- Swagger/OpenAPI

### Mobile (Customer & Worker)
- React Native + Expo
- Redux Toolkit
- React Query
- React Navigation
- Vision Camera (barcode scanning)
- React Native Paper
- Lottie animations

### Admin Dashboard
- React + Vite
- Material UI
- Redux Toolkit
- React Query
- Chart.js

### DevOps
- Docker + Docker Compose
- Nginx reverse proxy
- GitHub Actions CI/CD
- Railway / Render deployment

## License

MIT
