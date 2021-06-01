export class InternalServerError extends Error {
  constructor() {
    super('Internal Server Error: Try again later');
    this.name = 'InternalServerError';
  }
}
