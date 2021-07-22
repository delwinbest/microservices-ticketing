import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookiesession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { healthzRouter } from './routes/healthz';

import { errorHandler, NotFoundError } from '@drbtickets/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookiesession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);
app.use(healthzRouter);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
