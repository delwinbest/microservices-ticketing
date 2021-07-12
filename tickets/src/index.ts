import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('App starting...');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is not defined');
  }
  try {
    console.log('Connecting to mongodb://tickets-mongo-srv:27017/tickets..');
    await mongoose.connect('mongodb://tickets-mongo-srv:27017/tickets', {
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
