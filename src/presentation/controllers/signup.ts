import { MissingParamError, InvalidParamError } from '../errors';
import { BadRequest, ServerError } from '../helpers/http-helper';
import { HttpRequest, HttpResponse } from '../protocols/http';
import { ControllerHttp } from '../protocols/controller-http';
import { EmailValidator } from '../protocols/email-validator';

export class SignUpController implements ControllerHttp {
  private readonly emailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return BadRequest(new MissingParamError(field));
        }
      }

      const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);

      if (!isValidEmail) {
        return BadRequest(new InvalidParamError('email'));
      }

      return {
        statusCode: 200,
        body: {},
      };
    } catch (error) {
      return ServerError();
    }
  }
}
