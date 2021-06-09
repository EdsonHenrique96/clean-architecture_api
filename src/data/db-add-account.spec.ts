import { DbAddAccount } from './db-add-account';
import { Encrypter } from './protocols/encrypter';

class EncrypterStub implements Encrypter {
  async encrypt(data: string): Promise<string> { //eslint-disable-line
    return new Promise((resolve) => resolve('encrypted_password'));
  }
}

describe('UseCase DbAddAccount', () => {
  test('Should call Encrypter with correct password', async () => {
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

  test('Should throw when encrypter throws', async () => {
    const encrypterStub = new EncrypterStub();
    const sut = new DbAddAccount(encrypterStub);

    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()));

    const resultPromise = sut.add({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'invalid_password',
    });

    await expect(resultPromise).rejects.toThrow();
  });
});
