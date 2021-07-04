import { ValidationError } from 'express-validator';

export class RequestValidationError extends Error {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super();

    // Required when class extends built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  // formatedErrors = err.errors.map((error) => {
  //   return { message: error.msg, field: error.param };
  // });
  serializeErrors() {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}
