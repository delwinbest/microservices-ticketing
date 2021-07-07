import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // This function assums current user has been validated and set
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
};
