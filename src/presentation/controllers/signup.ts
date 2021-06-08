import { MissingParamError, InvalidParamError } from '../errors';
import { BadRequest, ServerError } from '../helpers/http-helper';
import { HttpRequest, HttpResponse } from '../protocols/http';
import { ControllerHttp } from '../protocols/controller-http';
import { EmailValidator } from '../protocols/email-validator';
import { AddAccount } from '../../domain/usecases/add-account';

export class SignUpController implements ControllerHttp {
  private readonly emailValidator;

  private readonly addAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return BadRequest(new MissingParamError(field));
        }
      }

      const {
        email,
        password,
        passwordConfirmation,
        name,
      } = httpRequest.body;

      const isValidEmail = this.emailValidator.isValid(email);

      if (!isValidEmail) {
        return BadRequest(new InvalidParamError('email'));
      }

      if (password !== passwordConfirmation) {
        return BadRequest(new InvalidParamError('passwordConfirmation'));
      }

      this.addAccount.add({
        name,
        email,
        password,
      });

      return {
        statusCode: 200,
        body: {},
      };
    } catch (error) {
      return ServerError();
    }
  }
}
