import validator from 'validator';
import { EmailValidatorAdapter } from './email-validator-adapter';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe('EmailValidatorAdapter', () => {
  test('Should return false when validator returns false', () => {
    const sut = new EmailValidatorAdapter();

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const isValidEmail = sut.isValid('invalid_email@mail.com');
    expect(isValidEmail).toBe(false);
  });

  test('Should return true when validator return true', () => {
    const sut = new EmailValidatorAdapter();
    const isValidEmail = sut.isValid('valid_email@mail.com');
    expect(isValidEmail).toBe(true);
  });
});
