/**
 * Seed Script — creates an admin, a store, and sample products for dev testing
 * Run with: npx tsx src/seed.ts
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Admin } from './models/Admin.model';
import { Store } from './models/Store.model';
import { Category } from './models/Category.model';
import { Product } from './models/Product.model';
import { Inventory } from './models/Inventory.model';
import { Worker } from './models/Worker.model';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartqueue';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing seed data
  await Promise.all([
    Admin.deleteMany({}),
    Store.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Inventory.deleteMany({}),
    Worker.deleteMany({}),
  ]);
  console.log('🧹 Cleared old seed data');

  // Create Store
  const store = await Store.create({
    name: 'SmartQueue Main Store',
    code: 'SQMAIN',
    address: { street: '123 MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
    phone: '9876543210',
    email: 'store@smartqueue.com',
    taxRate: 18,
    openingHours: { open: '09:00', close: '22:00' },
  });
  console.log(`🏪 Store created: ${store.name} (${store.code})`);

  // Create Admin
  const admin = await Admin.create({
    name: 'Super Admin',
    email: 'admin@smartqueue.com',
    password: 'Admin@123',
    role: 'superadmin',
    permissions: ['all'],
  });
  console.log(`👤 Admin created: ${admin.email} / Admin@123`);

  // Create Worker
  const worker = await Worker.create({
    name: 'Store Worker',
    email: 'worker@smartqueue.com',
    phone: '9876543211',
    password: 'Worker@123',
    employeeId: 'EMP001',
    storeId: store._id,
  });
  console.log(`👷 Worker created: ${worker.email} / Worker@123 (EmployeeId: ${worker.employeeId})`);

  // Create Categories
  const grocery = await Category.create({ name: 'Grocery', slug: 'grocery', sortOrder: 1 });
  const beverages = await Category.create({ name: 'Beverages', slug: 'beverages', sortOrder: 2 });
  const snacks = await Category.create({ name: 'Snacks', slug: 'snacks', parentId: grocery._id, sortOrder: 1 });
  console.log('📁 Categories created');

  // Create Products with Inventory
  const products = [
    { name: 'Amul Full Cream Milk 1L', barcode: '8901764100078', sku: 'AMUL-MILK-1L', brand: 'Amul', price: 62, mrp: 65, tax: 5, categoryId: grocery._id, unit: 'litre' },
    { name: 'Britannia Good Day Cookies 200g', barcode: '8901063007277', sku: 'BRIT-GOODDAY-200', brand: 'Britannia', price: 35, mrp: 40, tax: 12, categoryId: snacks._id, unit: 'pack' },
    { name: 'Pepsi 500ml', barcode: '8901012038032', sku: 'PEPSI-500ML', brand: 'PepsiCo', price: 30, mrp: 35, tax: 12, categoryId: beverages._id, unit: 'bottle' },
    { name: 'Maggi 2-Minute Noodles 70g', barcode: '8901058000020', sku: 'MAGGI-70G', brand: 'Nestle', price: 14, mrp: 15, tax: 12, categoryId: snacks._id, unit: 'pack' },
    { name: 'Tata Salt 1kg', barcode: '8901058810013', sku: 'TATA-SALT-1KG', brand: 'Tata', price: 20, mrp: 22, tax: 5, categoryId: grocery._id, unit: 'kg' },
  ];

  for (const p of products) {
    const product = await Product.create({
      ...p,
      storeId: store._id,
      slug: p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now(),
      description: `${p.name} - Quality product from ${p.brand}`,
      discountPercent: Math.round(((p.mrp - p.price) / p.mrp) * 100),
      images: [],
      tags: [p.brand.toLowerCase(), p.categoryId.toString()],
    });
    await Inventory.create({
      productId: product._id,
      storeId: store._id,
      quantity: 100,
      lowStockThreshold: 10,
    });
    console.log(`  📦 Product: ${product.name} (${product.barcode})`);
  }

  console.log('\n🎉 Seed complete!');
  console.log('----------------------------');
  console.log('API URL    : http://localhost:5000/api/v1');
  console.log('Swagger    : http://localhost:5000/api/v1/docs');
  console.log('Admin Login: admin@smartqueue.com / Admin@123');
  console.log('Worker Login: worker@smartqueue.com / Worker@123');
  console.log('Store Code : SQMAIN');
  console.log('----------------------------');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
