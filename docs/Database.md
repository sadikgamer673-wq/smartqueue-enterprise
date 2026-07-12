# Database Schema

MongoDB collections and their relationships.

## Core Collections

| Collection | Key Fields | References |
|---|---|---|
| `users` | email, phone, password, rewardPoints, walletBalance | storeId → stores |
| `workers` | email, employeeId, totalScans | storeId → stores |
| `admins` | email, role, permissions | — |
| `stores` | code, address, taxRate | — |
| `categories` | slug, parentId | parentId → categories |
| `products` | barcode (indexed), sku, price, mrp | categoryId → categories, storeId → stores |
| `inventory` | quantity, reservedQuantity | productId → products, storeId → stores |
| `carts` | items[], total | userId → users (unique), storeId → stores |
| `orders` | orderNumber, items[], status | userId → users, storeId → stores, paymentId → payments |
| `payments` | razorpayOrderId, razorpayPaymentId, status | orderId → orders |
| `qrCodes` | token (unique), encryptedData, isUsed, expiresAt (TTL) | orderId → orders |
| `coupons` | code, type, value, usageLimit | — |
| `notifications` | title, body, isRead | userId → polymorphic (User/Worker/Admin) |
| `auditLogs` | action, resource, changes | userId → polymorphic |
| `fraudLogs` | type, severity, resolved | orderId, workerId, storeId |

## Indexes

- `products`: compound unique `{ barcode, storeId }`, text index on `{ name, description, tags }`
- `orders`: `{ userId, createdAt: -1 }`, `{ storeId, createdAt: -1 }`, `{ orderNumber }`
- `qrCodes`: `{ token }`, TTL on `{ expiresAt }`
- `users`: `{ email }`, `{ phone }`

## Order Status Lifecycle

```
pending → paid → processing → completed
                            └→ verified (rejected by worker)
              └→ cancelled
              └→ refunded
```
