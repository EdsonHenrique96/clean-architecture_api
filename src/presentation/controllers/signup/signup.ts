import { MissingParamError, InvalidParamError } from '../../errors';
import { BadRequest, ok, ServerError } from '../../helpers/http-helper';
import { HttpRequest, HttpResponse } from '../../protocols/http';
import { ControllerHttp } from '../../protocols/controller-http';
import { EmailValidator } from '../../protocols/email-validator';
import { AddAccount } from '../../../domain/usecases/add-account';
import { AccountModel } from '../../../domain/models/account';

export class SignUpController implements ControllerHttp<AccountModel> {
  private readonly emailValidator: EmailValidator;

  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  async handle(httpRequest: HttpRequest)
    : Promise<HttpResponse<AccountModel | Error>> {
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

      const account = await this.addAccount.add({
        name,
        email,
        password,
      });

      return ok(account);
    } catch (error) {
      return ServerError();
    }
  }
}
