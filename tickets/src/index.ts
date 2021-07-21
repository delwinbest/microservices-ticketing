import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  console.log('App starting...');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is not defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }
  try {
    await natsWrapper.connect(
      'ticketing',
      'publisher001',
      'http://nats-srv:4222',
    );
    console.log('Connecting to ', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (err) {
    throw new Error(err);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000...');
  });
};

start();
