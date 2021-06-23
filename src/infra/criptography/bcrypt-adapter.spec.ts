import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

const MOCKED_HASH = '$2b$12$Ah9.5TXDZzrI66nFIWToKuTzW32U3C6yli.3q8Eb17D2GRM1fMHWa';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return MOCKED_HASH;
  },
}));

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a hash on success', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hash = await sut.encrypt('any_value');
    expect(hash).toBe(MOCKED_HASH);
  });
});
