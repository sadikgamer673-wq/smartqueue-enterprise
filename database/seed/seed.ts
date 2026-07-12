/**
 * Database seed script.
 * Run with: cd backend && pnpm tsx ../database/seed/seed.ts
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Store } from '../../backend/src/models/Store.model';
import { Category } from '../../backend/src/models/Category.model';
import { Product } from '../../backend/src/models/Product.model';
import { Inventory } from '../../backend/src/models/Inventory.model';
import { Admin } from '../../backend/src/models/Admin.model';
import { Worker } from '../../backend/src/models/Worker.model';

dotenv.config({ path: '../../backend/.env' });

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('Connected to MongoDB. Seeding...');

  await Promise.all([
    Store.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Inventory.deleteMany({}),
    Admin.deleteMany({}),
    Worker.deleteMany({}),
  ]);

  const store = await Store.create({
    name: 'SmartQueue Mall - Indiranagar',
    code: 'SQ001',
    address: { street: '100 Feet Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560038' },
    phone: '+91 9876543210',
    email: 'indiranagar@smartqueue.com',
    taxRate: 18,
  });

  const admin = await Admin.create({
    name: 'Store Admin',
    email: 'admin@smartqueue.com',
    password: 'Admin@123',
    role: 'superadmin',
  });

  const worker = await Worker.create({
    name: 'Ravi Kumar',
    email: 'worker@smartqueue.com',
    phone: '+91 9876543211',
    password: 'Worker@123',
    employeeId: 'EMP001',
    storeId: store._id,
  });

  const groceries = await Category.create({ name: 'Groceries', slug: 'groceries' });
  const beverages = await Category.create({ name: 'Beverages', slug: 'beverages' });
  const snacks = await Category.create({ name: 'Snacks', slug: 'snacks' });

  const products = await Product.insertMany([
    {
      name: 'Aashirvaad Atta 5kg',
      slug: 'aashirvaad-atta-5kg',
      description: 'Whole wheat flour, 5kg pack',
      barcode: '8901030875021',
      sku: 'GRO-001',
      categoryId: groceries._id,
      brand: 'Aashirvaad',
      images: ['https://placehold.co/400x400?text=Atta'],
      price: 245,
      mrp: 270,
      discountPercent: 9,
      tax: 5,
      unit: 'pack',
      storeId: store._id,
      tags: ['flour', 'wheat', 'staple'],
    },
    {
      name: 'Coca-Cola 750ml',
      slug: 'coca-cola-750ml',
      description: 'Carbonated soft drink',
      barcode: '8901491101213',
      sku: 'BEV-001',
      categoryId: beverages._id,
      brand: 'Coca-Cola',
      images: ['https://placehold.co/400x400?text=Coke'],
      price: 40,
      mrp: 45,
      discountPercent: 11,
      tax: 18,
      unit: 'bottle',
      storeId: store._id,
      tags: ['drink', 'soda'],
    },
    {
      name: "Lay's Classic Salted 52g",
      slug: 'lays-classic-salted-52g',
      description: 'Potato chips, classic salted flavor',
      barcode: '8901058851026',
      sku: 'SNK-001',
      categoryId: snacks._id,
      brand: "Lay's",
      images: ['https://placehold.co/400x400?text=Lays'],
      price: 20,
      mrp: 20,
      discountPercent: 0,
      tax: 12,
      unit: 'pack',
      storeId: store._id,
      tags: ['chips', 'snacks'],
    },
  ]);

  await Inventory.insertMany(
    products.map((p) => ({
      productId: p._id,
      storeId: store._id,
      quantity: 100,
      lowStockThreshold: 10,
    }))
  );

  console.log('Seed complete:');
  console.log(`  Store: ${store.name} (${store.code})`);
  console.log(`  Admin login: admin@smartqueue.com / Admin@123`);
  console.log(`  Worker login: worker@smartqueue.com / Worker@123`);
  console.log(`  Products created: ${products.length}`);

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
