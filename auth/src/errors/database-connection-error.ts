export class DatabaseConnectionError extends Error {
  reason = 'Error connecting to database';
  statusCode = 500;
  constructor() {
    super();

    // Required when class extends built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return {
      message: this.reason,
    };
  }
}
