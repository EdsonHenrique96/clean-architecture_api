/* eslint max-classes-per-file: ["error", 2] */
import { SignUpController } from './signup';
import { MissingParamError } from '../errors/missing-param-error';
import { InvalidParamError } from '../errors/invalid-param-error';
import { InternalServerError } from '../errors/internal-server-error';
import { EmailValidator } from '../protocols/email-validator';

class EmailValidatorStub implements EmailValidator {
  isValid(email: string): boolean { // eslint-disable-line
    return true;
  }
}

interface SutFactoryInterface {
  sut: SignUpController;
  emailValidator: EmailValidator
}

function sutFactory(): SutFactoryInterface {
  const emailValidator = new EmailValidatorStub();
  const sut = new SignUpController(emailValidator);

  return {
    sut,
    emailValidator,
  };
}

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    const { sut } = sutFactory();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('should return 400 if no email is provided', () => {
    const { sut } = sutFactory();
    const httpRequest = {
      body: {
        name: 'any',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('should return 400 if no password is provided', () => {
    const { sut } = sutFactory();
    const httpRequest = {
      body: {
        name: 'any',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = sutFactory();
    const httpRequest = {
      body: {
        name: 'any',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'));
  });

  test('should return 400 if an invalid email is provided', () => {
    const { sut, emailValidator } = sutFactory();

    jest.spyOn(emailValidator, 'isValid')
      .mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'any',
        email: 'invalid@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('should calls EmailValidator with correct email', () => {
    const { sut, emailValidator } = sutFactory();

    const emailValidatorSpy = jest.spyOn(emailValidator, 'isValid');

    const httpRequest = {
      body: {
        name: 'any',
        email: 'invalid@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    sut.handle(httpRequest);
    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  test('should return 500 when EmailValidator throws', () => {
    class EmailValidatorWithError implements EmailValidator {
      isValid(email: string): boolean { // eslint-disable-line
        throw new Error();
      }
    }

    const emailValidatorWithError = new EmailValidatorWithError();
    const sut = new SignUpController(emailValidatorWithError);

    const httpRequest = {
      body: {
        name: 'any',
        email: 'invalid@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new InternalServerError());
  });
});
