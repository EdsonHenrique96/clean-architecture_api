/* eslint max-classes-per-file: ["error", 2] */
import { SignUpController } from './signup';
import { MissingParamError, InvalidParamError, InternalServerError } from '../errors';
import { EmailValidator } from '../protocols/email-validator';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean { // eslint-disable-line
      return true;
    }
  }

  return new EmailValidatorStub();
};

interface MakeSutInterface {
  sut: SignUpController;
  emailValidator: EmailValidator
}

function makeSut(): MakeSutInterface {
  const emailValidator = makeEmailValidator();
  const sut = new SignUpController(emailValidator);

  return {
    sut,
    emailValidator,
  };
}

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    const { sut } = makeSut();
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
    const { sut } = makeSut();
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
    const { sut } = makeSut();
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
    const { sut } = makeSut();
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
    const { sut, emailValidator } = makeSut();

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
    const { sut, emailValidator } = makeSut();

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

  test('should return 400 if password confirmation fails', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password_12',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'));
  });

  test('should return 500 when EmailValidator throws', () => {
    const { sut, emailValidator } = makeSut();
    // mudando o retorno da função mockada
    jest
      .spyOn(emailValidator, 'isValid')
      .mockImplementationOnce(() => { throw new Error(); });

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
