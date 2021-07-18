import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookiesession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@drbtickets/common';

import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookiesession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);
app.use(currentUser);
app.use(showTicketRouter);
app.use(createTicketRouter);
app.use(indexTicketRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
