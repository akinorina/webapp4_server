import { AccountType } from 'src';

export class UpdateUserDto {
  username: string;
  familyname: string;
  firstname: string;
  familynameKana: string;
  firstnameKana: string;
  email: string;
  password: string;
  accountType: AccountType;
  agreeTerms: string;
  stripeCustomerId: string;
}
