import { DbAddAccount } from './db-add-account';
import { Encrypter } from './protocols/encrypter';

describe('UseCase DbAddAccount', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncrypterStub implements Encrypter {
      async encrypt(data: string): Promise<string> { //eslint-disable-line
        return new Promise((resolve) => resolve('encrypted_password'));
      }
    }

    const encrypterStub = new EncrypterStub();

    const sut = new DbAddAccount(encrypterStub);

    const dataAccount = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt');

    await sut.add(dataAccount);
    expect(encrypterSpy).toHaveBeenCalledWith(dataAccount.password);
  });

  test('Should throw when encrypter throws', () => {});
});
