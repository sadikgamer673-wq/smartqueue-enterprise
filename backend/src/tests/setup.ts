import mongoose from 'mongoose';

const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/smartqueue_test';

beforeAll(async () => {
  // Ensure we are connected to the test database
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGODB_URI);
  }
});

afterAll(async () => {
  // Clear and close connection
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    await mongoose.connection.close();
  }
});
