import { AccountModel } from '../models/account';

export interface AddAccountDTO {
  name: string;
  email: string;
  password: string;
}

export interface AddAccount {
  add(account: AddAccountDTO): AccountModel;
}
