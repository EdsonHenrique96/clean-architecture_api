import { HttpResponse } from '../protocols/http';
import { InternalServerError } from '../errors';

export const BadRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  body: error,
});

export const ServerError = (): HttpResponse<InternalServerError> => ({
  statusCode: 500,
  body: new InternalServerError(),
});

export const ok = <T>(data: T): HttpResponse<T> => ({
  statusCode: 200,
  body: data,
});
