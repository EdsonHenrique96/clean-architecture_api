import { HttpRequest, HttpResponse } from './http';

export interface ControllerHttp {
  handle(httpRequest: HttpRequest): HttpResponse
}