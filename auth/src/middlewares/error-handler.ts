import { Request, Response, NextFunction } from 'express';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { RequestValidationError } from '../errors/request-validation-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof RequestValidationError) {
    console.log('handling this error as RequestValidationError');

    res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  } else if (err instanceof DatabaseConnectionError) {
    console.log('handling this error as DatabaseConnectionError');
    res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  } else {
    res.status(500).send({
      errors: [
        {
          message: 'Something went wrong',
        },
      ],
    });
  }
};
