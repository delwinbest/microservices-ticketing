import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookiesession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { healthzRouter } from './routes/healthz';

import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookiesession({
    signed: false,
    secure: true,
  }),
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(healthzRouter);
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

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
