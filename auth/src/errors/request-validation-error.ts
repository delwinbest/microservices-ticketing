import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

// interface CustomError {
//   statusCode: number;
//   serializeErrors(): {
//     message: string;
//     field?: string;
//   }[];
// }

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Invalid Request parameters');

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
