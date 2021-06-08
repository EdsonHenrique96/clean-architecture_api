import { HttpRequest, HttpResponse } from './http';

export interface ControllerHttp<T> {
  handle(httpRequest: HttpRequest): Promise<HttpResponse<T | Error>>
}
