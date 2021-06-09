import validator from 'validator';
import { EmailValidator } from '../presentation/protocols/email-validator';
import { EmailValidatorAdapter } from './email-validator-adapter';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeSut = (): EmailValidator => new EmailValidatorAdapter();

describe('EmailValidatorAdapter', () => {
  test('Should return false when validator returns false', () => {
    const sut = makeSut();

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const isValidEmail = sut.isValid('invalid_email@mail.com');
    expect(isValidEmail).toBe(false);
  });

  test('Should return true when validator returns true', () => {
    const sut = makeSut();
    const isValidEmail = sut.isValid('valid_email@mail.com');
    expect(isValidEmail).toBe(true);
  });

  test('Should calls validator lib with correct values', () => {
    const email = 'any_email@mail.com';
    const sut = makeSut();

    const validatorSpy = jest.spyOn(validator, 'isEmail');

    sut.isValid(email);

    expect(validatorSpy).toHaveBeenCalledWith(email);
  });
});
