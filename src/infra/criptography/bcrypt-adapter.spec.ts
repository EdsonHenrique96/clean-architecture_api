import bcrypt from 'bcrypt';
import { Encrypter } from '../../data/protocols/encrypter';
import { BcryptAdapter } from './bcrypt-adapter';

const MOCKED_HASH = '$2b$12$Ah9.5TXDZzrI66nFIWToKuTzW32U3C6yli.3q8Eb17D2GRM1fMHWa';
const SALT = 12;

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return MOCKED_HASH;
  },
}));

const makeSut = (): Encrypter => new BcryptAdapter(SALT);

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT);
  });

  test('Should return a hash on success', async () => {
    const sut = makeSut();
    const hash = await sut.encrypt('any_value');
    expect(hash).toBe(MOCKED_HASH);
  });

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash')
      .mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.encrypt('any_value');
    await expect(promise).rejects.toThrow();
  });
});
