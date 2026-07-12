# Architecture

## System Overview

SmartQueue Enterprise is a microservice-influenced monolith backend serving three frontend clients: a customer mobile app, a worker mobile app, and an admin web dashboard.

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Customer App    │     │   Worker App    │     │  Admin Dashboard  │
│  (Expo / RN)     │     │  (Expo / RN)    │     │  (React / Vite)   │
└────────┬─────────┘     └────────┬────────┘     └─────────┬────────┘
         │                        │                         │
         └────────────┬───────────┴─────────────────────────┘
                       │ REST + Socket.IO
              ┌────────▼─────────┐
              │   Backend API     │
              │  Node + Express   │
              │   + TypeScript    │
              └────────┬──────────┘
                       │
        ┌──────────────┼───────────────┬──────────────┐
        │              │               │              │
  ┌─────▼─────┐  ┌─────▼─────┐  ┌──────▼─────┐  ┌─────▼──────┐
  │ MongoDB    │  │ Razorpay  │  │ Cloudinary │  │   Redis    │
  │ Atlas      │  │ (Payments)│  │  (Images)  │  │  (Cache)   │
  └────────────┘  └───────────┘  └────────────┘  └────────────┘
```

## Layered Backend Architecture

```
Routes → Controllers → Services → Repositories → Models (Mongoose)
            │
            ├── Middleware (auth, validation, error handling)
            └── Utils (crypto, response helpers)
```

- **Routes** define endpoints and apply middleware.
- **Controllers** handle HTTP request/response, delegate to services.
- **Services** contain business logic (auth, cart pricing, QR encryption, payment verification).
- **Models** define MongoDB schemas via Mongoose.

## QR Code Security Flow

1. Order is marked `paid` after Razorpay signature verification.
2. `qrService.generateQR()` creates a random 32-byte token, bundles order metadata, encrypts it with AES-256-CBC.
3. QR image is generated client-side via the `qrcode` library and returned as a data URL.
4. Worker scans QR → backend decrypts → validates: not used, not expired, correct store.
5. On scan, QR is immediately marked `isUsed: true` to prevent replay.
6. Worker approves/rejects → order status updated → customer notified in real time via Socket.IO room `user:{userId}`.

## Real-time Events (Socket.IO)

| Event | Direction | Payload |
|-------|-----------|---------|
| `order:verified` | Server → Customer | `{ orderId, action, message }` |
| `inventory:low` | Server → Admins | `{ productId, quantity }` |
| `order:new` | Server → Store workers | `{ orderId, storeId }` |

## Data Consistency

- Cart totals are recalculated server-side on every mutation (never trust client totals).
- Inventory uses `reservedQuantity` to prevent overselling during checkout race conditions.
- QR codes have a MongoDB TTL index (`expiresAt`) for automatic cleanup.
