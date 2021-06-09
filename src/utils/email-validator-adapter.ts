import { EmailValidator } from '../presentation/protocols/email-validator';

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean { //eslint-disable-line
    return false;
  }
}
