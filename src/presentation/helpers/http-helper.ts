import { HttpResponse } from '../protocols/http';
import { InternalServerError } from '../errors/internal-server-error';

export const BadRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const ServerError = (): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError(),
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});
