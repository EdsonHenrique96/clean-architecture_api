/* eslint max-classes-per-file: ["error", 2] */
import { DbAddAccount } from './db-add-account';
import { Encrypter } from '../../protocols/encrypter';
import { AddAccountDTO } from '../../../domain/usecases/add-account';
import { AccountModel } from '../../../domain/models/account';
import { AddAccountRepository } from '../../protocols/add-account-repository';

interface MakeSutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): MakeSutTypes => {
  class EncrypterStub implements Encrypter {
    async encrypt(data: string): Promise<string> { //eslint-disable-line
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }

  const encrypterStub = new EncrypterStub();

  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountDTO): Promise<AccountModel> {
      return {
        ...accountData,
        id: 'valid_id',
      };
    }
  }

  const addAccountRepositoryStub = new AddAccountRepositoryStub();

  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  };
};

describe('UseCase DbAddAccount', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt');

    await sut.add(accountData);
    expect(encrypterSpy).toHaveBeenCalledWith(accountData.password);
  });

  test('Should throw when encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();

    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()));

    const resultPromise = sut.add({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'invalid_password',
    });

    await expect(resultPromise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    const addAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add');

    await sut.add(accountData);
    expect(addAccountRepositorySpy).toHaveBeenCalledWith({ ...accountData, password: 'hashed_password' });
  });

  test('Should throw when AddAccountRepository throws', async () => {
  });

  test('Should return an Account with hashed password on success', async () => {
  });
});
