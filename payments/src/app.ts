import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookiesession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@drbtickets/common';

import { healthzRouter } from './routes/healthz';
import { createChargeRouter } from './routes/new';

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
app.use(currentUser);
app.use(createChargeRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
