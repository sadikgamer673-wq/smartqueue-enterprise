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
  const dairy = await Category.create({ name: 'Dairy & Eggs', slug: 'dairy', sortOrder: 2 });
  const beverages = await Category.create({ name: 'Beverages', slug: 'beverages', sortOrder: 3 });
  const snacks = await Category.create({ name: 'Snacks & Sweets', slug: 'snacks', sortOrder: 4 });
  const personalCare = await Category.create({ name: 'Personal Care', slug: 'personal-care', sortOrder: 5 });
  const household = await Category.create({ name: 'Household Essentials', slug: 'household', sortOrder: 6 });
  console.log('📁 Categories created');

  // Create Products with Inventory
  const products = [
    // --- GROCERY ---
    { name: 'Fortune Soya Health Oil 1L', barcode: '8906007281358', sku: 'FORT-SOYA-1L', brand: 'Fortune', price: 125, mrp: 140, tax: 5, categoryId: grocery._id, unit: 'litre' },
    { name: 'Aashirvaad Shudh Chakki Atta 5kg', barcode: '8901725181221', sku: 'AASH-ATTA-5KG', brand: 'Aashirvaad', price: 260, mrp: 285, tax: 5, categoryId: grocery._id, unit: 'kg' },
    { name: 'India Gate Basmati Rice 1kg', barcode: '8901537006222', sku: 'IG-BASMATI-1KG', brand: 'India Gate', price: 110, mrp: 130, tax: 5, categoryId: grocery._id, unit: 'kg' },
    { name: 'Tata Salt 1kg', barcode: '8901058810013', sku: 'TATA-SALT-1KG', brand: 'Tata', price: 20, mrp: 22, tax: 5, categoryId: grocery._id, unit: 'kg' },
    { name: 'Madhur Pure Hygienic Sugar 1kg', barcode: '8906006890339', sku: 'MADH-SUGAR-1KG', brand: 'Madhur', price: 48, mrp: 55, tax: 5, categoryId: grocery._id, unit: 'kg' },
    { name: 'Catch Turmeric Powder 100g', barcode: '8901148023101', sku: 'CATCH-HALDI-100G', brand: 'Catch', price: 28, mrp: 30, tax: 5, categoryId: grocery._id, unit: 'pack' },
    { name: 'Catch Coriander Powder 100g', barcode: '8901148023118', sku: 'CATCH-DHANIYA-100G', brand: 'Catch', price: 32, mrp: 35, tax: 5, categoryId: grocery._id, unit: 'pack' },
    { name: 'Catch Red Chili Powder 100g', barcode: '8901148023125', sku: 'CATCH-MIRCH-100G', brand: 'Catch', price: 42, mrp: 45, tax: 5, categoryId: grocery._id, unit: 'pack' },
    { name: 'Tata Sampann Toor Dal 1kg', barcode: '8901058860711', sku: 'TATA-TOORDAL-1KG', brand: 'Tata Sampann', price: 175, mrp: 195, tax: 5, categoryId: grocery._id, unit: 'kg' },
    { name: 'Tata Sampann Kabuli Chana 500g', barcode: '8901058863200', sku: 'TATA-CHANA-500G', brand: 'Tata Sampann', price: 85, mrp: 95, tax: 5, categoryId: grocery._id, unit: 'pack' },

    // --- DAIRY & EGGS ---
    { name: 'Amul Full Cream Milk 1L', barcode: '8901764100078', sku: 'AMUL-MILK-1L', brand: 'Amul', price: 62, mrp: 66, tax: 5, categoryId: dairy._id, unit: 'litre' },
    { name: 'Amul Butter 500g', barcode: '8901764010124', sku: 'AMUL-BUTTER-500G', brand: 'Amul', price: 255, mrp: 275, tax: 12, categoryId: dairy._id, unit: 'pack' },
    { name: 'Amul Pure Ghee 1L Tin', barcode: '8901764021205', sku: 'AMUL-GHEE-1L', brand: 'Amul', price: 630, mrp: 670, tax: 12, categoryId: dairy._id, unit: 'tin' },
    { name: 'Amul Cheese Slices 200g', barcode: '8901764061218', sku: 'AMUL-CHEESE-200G', brand: 'Amul', price: 140, mrp: 150, tax: 12, categoryId: dairy._id, unit: 'pack' },
    { name: 'Mother Dairy Fresh Paneer 200g', barcode: '8901648002083', sku: 'MD-PANEER-200G', brand: 'Mother Dairy', price: 80, mrp: 85, tax: 5, categoryId: dairy._id, unit: 'pack' },
    { name: 'Amul Masti Spiced Buttermilk 200ml', barcode: '8901764071309', sku: 'AMUL-TAAS-200ML', brand: 'Amul', price: 15, mrp: 15, tax: 5, categoryId: dairy._id, unit: 'pack' },
    { name: 'Amul Taaza Toned Milk 500ml', barcode: '8901764100061', sku: 'AMUL-TONED-500ML', brand: 'Amul', price: 27, mrp: 28, tax: 5, categoryId: dairy._id, unit: 'pack' },
    { name: 'Amul Masti Dahi 400g', barcode: '8901764031204', sku: 'AMUL-DAHI-400G', brand: 'Amul', price: 35, mrp: 40, tax: 5, categoryId: dairy._id, unit: 'pack' },

    // --- BEVERAGES ---
    { name: 'Pepsi 500ml', barcode: '8901012038032', sku: 'PEPSI-500ML', brand: 'PepsiCo', price: 30, mrp: 35, tax: 18, categoryId: beverages._id, unit: 'bottle' },
    { name: 'Coca Cola 250ml Can', barcode: '8901764032225', sku: 'COKE-CAN-250ML', brand: 'Coca Cola', price: 25, mrp: 30, tax: 18, categoryId: beverages._id, unit: 'can' },
    { name: 'Nescafe Classic Coffee 100g Jar', barcode: '8901058895065', sku: 'NES-COFFEE-100G', brand: 'Nescafe', price: 320, mrp: 345, tax: 18, categoryId: beverages._id, unit: 'jar' },
    { name: 'Taj Mahal Tea Bags 100s', barcode: '8901030752536', sku: 'TAJ-TEA-100S', brand: 'Brooke Bond', price: 210, mrp: 230, tax: 5, categoryId: beverages._id, unit: 'pack' },
    { name: 'Tropicana Orange Juice 1L', barcode: '8901012111070', sku: 'TROP-ORANGE-1L', brand: 'Tropicana', price: 110, mrp: 125, tax: 12, categoryId: beverages._id, unit: 'pack' },
    { name: 'Real Mixed Fruit Juice 1L', barcode: '8901207040520', sku: 'REAL-MIX-1L', brand: 'Real', price: 105, mrp: 120, tax: 12, categoryId: beverages._id, unit: 'pack' },
    { name: 'Red Bull Energy Drink 250ml', barcode: '9002490100117', sku: 'REDBULL-250ML', brand: 'Red Bull', price: 115, mrp: 125, tax: 18, categoryId: beverages._id, unit: 'can' },
    { name: 'Sprite 2L', barcode: '8901764031235', sku: 'SPRITE-2L', brand: 'Coca Cola', price: 90, mrp: 95, tax: 18, categoryId: beverages._id, unit: 'bottle' },
    { name: 'Lipton Green Tea Honey Lemon 25s', barcode: '8901030753090', sku: 'LIP-GREENTEA-25', brand: 'Lipton', price: 145, mrp: 160, tax: 5, categoryId: beverages._id, unit: 'pack' },

    // --- SNACKS & SWEETS ---
    { name: 'Britannia Good Day Cookies 200g', barcode: '8901063007277', sku: 'BRIT-GOODDAY-200', brand: 'Britannia', price: 35, mrp: 40, tax: 18, categoryId: snacks._id, unit: 'pack' },
    { name: 'Maggi 2-Minute Noodles 70g', barcode: '8901058000020', sku: 'MAGGI-70G', brand: 'Nestle', price: 14, mrp: 15, tax: 18, categoryId: snacks._id, unit: 'pack' },
    { name: 'Lays Potato Chips India Magic Masala', barcode: '8901012166544', sku: 'LAYS-MAGIC-50G', brand: 'Lays', price: 20, mrp: 20, tax: 18, categoryId: snacks._id, unit: 'pack' },
    { name: 'Kurkure Masala Munch 90g', barcode: '8901012176338', sku: 'KURKURE-MUNCH-90G', brand: 'Kurkure', price: 20, mrp: 20, tax: 18, categoryId: snacks._id, unit: 'pack' },
    { name: 'Oreo Original Cream Biscuits 120g', barcode: '7622300744411', sku: 'OREO-ORIG-120G', brand: 'Cadbury', price: 30, mrp: 35, tax: 18, categoryId: snacks._id, unit: 'pack' },
    { name: 'Cadbury Dairy Milk Silk Chocolate 60g', barcode: '7622210815417', sku: 'CDM-SILK-60G', brand: 'Cadbury', price: 80, mrp: 85, tax: 18, categoryId: snacks._id, unit: 'pack' },
    { name: 'Haldirams Bhujia Sev 350g', barcode: '8904063200150', sku: 'HALD-BHUJIA-350G', brand: 'Haldirams', price: 95, mrp: 110, tax: 18, categoryId: snacks._id, unit: 'pack' },
    { name: 'Parle-G Gold Biscuits 1kg', barcode: '8901163300300', sku: 'PARLE-G-GOLD-1KG', brand: 'Parle', price: 75, mrp: 80, tax: 18, categoryId: snacks._id, unit: 'pack' },
    { name: 'Yippee Magic Masala Noodles 280g', barcode: '8901725191220', sku: 'YIP-NOODLES-280G', brand: 'Sunfeast', price: 48, mrp: 52, tax: 18, categoryId: snacks._id, unit: 'pack' },

    // --- PERSONAL CARE ---
    { name: 'Dove Cream Beauty Bar Soap 100g', barcode: '8901030704382', sku: 'DOVE-SOAP-100G', brand: 'Dove', price: 58, mrp: 62, tax: 18, categoryId: personalCare._id, unit: 'bar' },
    { name: 'Colgate MaxFresh Toothpaste 150g', barcode: '8901117275605', sku: 'COL-MAXFRESH-150G', brand: 'Colgate', price: 98, mrp: 110, tax: 18, categoryId: personalCare._id, unit: 'pack' },
    { name: 'Dettol Liquid Handwash Original 200ml', barcode: '8901396328324', sku: 'DET-HW-200ML', brand: 'Dettol', price: 89, mrp: 99, tax: 18, categoryId: personalCare._id, unit: 'bottle' },
    { name: 'Head & Shoulders Cool Menthol 340ml', barcode: '4902430908351', sku: 'HS-MENTHOL-340ML', brand: 'Head & Shoulders', price: 310, mrp: 350, tax: 18, categoryId: personalCare._id, unit: 'bottle' },
    { name: 'Gillette Guard Shaving Razor', barcode: '4902430303102', sku: 'GIL-GUARD-RAZOR', brand: 'Gillette', price: 22, mrp: 25, tax: 18, categoryId: personalCare._id, unit: 'piece' },
    { name: 'Nivea Body Milk Lotion 400ml', barcode: '4005808242220', sku: 'NIV-LOTION-400ML', brand: 'Nivea', price: 340, mrp: 399, tax: 18, categoryId: personalCare._id, unit: 'bottle' },
    { name: 'Pears Pure & Gentle Soap 125g', barcode: '8901030704207', sku: 'PEARS-SOAP-125G', brand: 'Pears', price: 72, mrp: 78, tax: 18, categoryId: personalCare._id, unit: 'bar' },
    { name: 'Clinic Plus Strong & Long 340ml', barcode: '8901030752000', sku: 'CLINIC-SHAMPOO-340', brand: 'Clinic Plus', price: 165, mrp: 185, tax: 18, categoryId: personalCare._id, unit: 'bottle' },

    // --- HOUSEHOLD ESSENTIALS ---
    { name: 'Surf Excel Easy Wash Detergent 1kg', barcode: '8901030701114', sku: 'SURF-EASY-1KG', brand: 'Surf Excel', price: 135, mrp: 150, tax: 18, categoryId: household._id, unit: 'kg' },
    { name: 'Vim Lemon Dishwash Liquid 500ml', barcode: '8901030691231', sku: 'VIM-LIQ-500ML', brand: 'Vim', price: 105, mrp: 115, tax: 18, categoryId: household._id, unit: 'bottle' },
    { name: 'Harpic Disinfectant Toilet Cleaner 1L', barcode: '8901396349145', sku: 'HARPIC-TOILET-1L', brand: 'Harpic', price: 195, mrp: 215, tax: 18, categoryId: household._id, unit: 'bottle' },
    { name: 'Lizol Disinfectant Floor Cleaner 1L', barcode: '8901396348827', sku: 'LIZOL-FLOOR-1L', brand: 'Lizol', price: 205, mrp: 225, tax: 18, categoryId: household._id, unit: 'bottle' },
    { name: 'Dettol Antiseptic Liquid 500ml', barcode: '8901396388403', sku: 'DET-AS-500ML', brand: 'Dettol', price: 220, mrp: 240, tax: 18, categoryId: household._id, unit: 'bottle' },
    { name: 'Colin Glass Cleaner Spray 500ml', barcode: '8901396366050', sku: 'COLIN-500ML', brand: 'Colin', price: 92, mrp: 99, tax: 18, categoryId: household._id, unit: 'bottle' },
    { name: 'Comfort After Wash Conditioner 860ml', barcode: '8901030730077', sku: 'COMF-COND-860ML', brand: 'Comfort', price: 215, mrp: 235, tax: 18, categoryId: household._id, unit: 'bottle' }
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
