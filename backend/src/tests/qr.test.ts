import mongoose from 'mongoose';
import { Order } from '../models/Order.model';
import { User } from '../models/User.model';
import { Product } from '../models/Product.model';
import { QRCode as QRCodeModel } from '../models/QRCode.model';
import { Store } from '../models/Store.model';
import { qrService } from '../services/qr.service';

describe('QRService Integration Tests', () => {
  let storeId: string;
  let orderId: string;
  const userId = new mongoose.Types.ObjectId().toString();
  const workerId = new mongoose.Types.ObjectId().toString();

  beforeAll(async () => {
    // Reference models to prevent tree-shaking pruning unused imports
    const _user = User.modelName;
    const _product = Product.modelName;

    // Create seed data for testing
    const store = await Store.create({
      name: 'Exit Test Store',
      code: 'EXSTORE',
      address: { street: 'Exit St', city: 'City', state: 'State', pincode: '111111' },
      phone: '1234567890',
      email: 'exit@store.com',
      taxRate: 18,
    });
    storeId = store._id.toString();

    // Create seed user
    await User.create({
      _id: new mongoose.Types.ObjectId(userId),
      name: 'Test Customer',
      email: 'customer@test.com',
      phone: '1234567890',
      password: 'password123',
    });

    // Create an order in 'paid' state (requirement to generate QR)
    const order = await Order.create({
      orderNumber: 'SQ-TEST-QR-999',
      userId: new mongoose.Types.ObjectId(userId),
      storeId: store._id,
      items: [
        {
          productId: new mongoose.Types.ObjectId(),
          name: 'Item A',
          barcode: '11111',
          image: '',
          price: 50,
          mrp: 50,
          quantity: 2,
          tax: 0,
          total: 100,
        },
      ],
      subtotal: 100,
      totalTax: 0,
      totalDiscount: 0,
      total: 100,
      status: 'paid',
    });
    orderId = order._id.toString();
  });

  afterAll(async () => {
    await Store.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await QRCodeModel.deleteMany({});
  });

  it('should generate a QR code image and encrypted token', async () => {
    const result = await qrService.generateQR(orderId, userId);
    expect(result).toBeDefined();
    expect(result.qrImage).toContain('data:image/png;base64');
    expect(result.token).toBeDefined();

    // The order status should now be updated to 'processing'
    const order = await Order.findById(orderId);
    expect(order?.status).toBe('processing');
  });

  it('should validate a correct QR token', async () => {
    const qrRecord = await QRCodeModel.findOne({ orderId });
    expect(qrRecord).toBeDefined();

    const validation = await qrService.validateQR(qrRecord!.encryptedData, workerId, storeId);
    expect(validation.valid).toBe(true);
    expect(validation.order).toBeDefined();
    expect(validation.order.orderNumber).toBe('SQ-TEST-QR-999');
  });

  it('should reject already used or expired QR codes', async () => {
    const qrRecord = await QRCodeModel.findOne({ orderId });

    // Mark as used
    await QRCodeModel.findByIdAndUpdate(qrRecord!._id, { isUsed: true });

    const validation = await qrService.validateQR(qrRecord!.encryptedData, workerId, storeId);
    expect(validation.valid).toBe(false);
    expect(validation.message).toContain('already been used');
  });
});
