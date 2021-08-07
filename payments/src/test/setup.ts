import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: any;
jest.mock('../nats-wrapper');
process.env.STRIPE_KEY =
  'sk_test_51JLEtaFDpPzxodB6uuGFn9ZqZbKWyCMU3MUkLUdKWIHQnob1NmxPuJvocPsoS7QlZjX8c1scOoKb3qhlriZud3TE00TF7wYsDA';

beforeAll(async () => {
  // Define environment variables
  process.env.JWT_KEY = 'QWERTY';

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
