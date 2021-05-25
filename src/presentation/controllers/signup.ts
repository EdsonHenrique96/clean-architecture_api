import { HttpRequest, HttpResponse } from '../protocols/http';
import { MissingParamError } from '../errors/missing-param-error';
import { BadRequest } from '../helpers/http-helper';
import { ControllerHttp } from '../protocols/controller-http';

export class SignUpController implements ControllerHttp {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return BadRequest(new MissingParamError(field));
      }
    }

    return {
      statusCode: 200,
      body: {},
    };
  }
}
