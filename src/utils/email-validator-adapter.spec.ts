import { EmailValidatorAdapter } from './email-validator-adapter';

describe('EmailValidatorAdapter', () => {
  test('Should return false when validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    const isValidEmail = sut.isValid('invalid_email@mail.com');
    expect(isValidEmail).toBe(false);
  });
});
