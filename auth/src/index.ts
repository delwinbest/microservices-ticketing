import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('App starting...');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is not defined');
  }
  try {
    console.log('Connecting to mongodb://auth-mongo-srv:27017/auth..');
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (err) {
    throw new Error(err);
    return;
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000...');
  });
};

start();
