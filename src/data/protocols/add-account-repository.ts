import { AccountModel } from '../../domain/models/account';
import { AddAccountDTO } from '../../domain/usecases/add-account';

export interface AddAccountRepository {
  add(accountData: AddAccountDTO): Promise<AccountModel>
}
