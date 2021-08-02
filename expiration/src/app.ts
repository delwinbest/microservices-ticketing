import express from 'express';
import 'express-async-errors';
import { errorHandler, NotFoundError } from '@drbtickets/common';

import { healthzRouter } from './routes/healthz';

const app = express();
app.set('trust proxy', true);
app.use(healthzRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
