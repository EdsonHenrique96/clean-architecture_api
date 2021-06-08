/* eslint max-classes-per-file: ["error", 3] */
import { SignUpController } from './signup';
import { MissingParamError, InvalidParamError, InternalServerError } from '../../errors';
import { EmailValidator } from '../../protocols/email-validator';
import { AddAccount, AddAccountDTO } from '../../../domain/usecases/add-account';
import { AccountModel } from '../../../domain/models/account';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean { // eslint-disable-line
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = ():AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountDTO): AccountModel { // eslint-disable-line
      return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
      };
    }
  }

  return new AddAccountStub();
};

interface MakeSutInterface {
  sut: SignUpController;
  emailValidator: EmailValidator
  addAccount: AddAccount
}

function makeSut(): MakeSutInterface {
  const emailValidator = makeEmailValidator();
  const addAccount = makeAddAccount();
  const sut = new SignUpController(emailValidator, addAccount);

  return {
    sut,
    emailValidator,
    addAccount,
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

  test('Should calls addAccount with correct params', () => {
    const { sut, addAccount } = makeSut();

    const addSpy = jest.spyOn(addAccount, 'add');

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    };

    sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    });
  });

  test('should return 500 when AddAccount throws', () => {
    const { sut, addAccount } = makeSut();
    // mudando o retorno da função mockada
    jest
      .spyOn(addAccount, 'add')
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

  test('should return 200 when AddAccount was successful', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'valid',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    });
  });
});
