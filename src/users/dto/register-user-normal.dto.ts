import { IsNotEmpty, IsEmail, Length } from 'class-validator';
import { AccountType } from 'src';

export class RegisterUserNormalDto {
  @IsNotEmpty()
  @Length(1, 200)
  username: string;

  @IsNotEmpty()
  @Length(1, 10)
  familyname: string;

  @IsNotEmpty()
  @Length(1, 10)
  firstname: string;

  @Length(1, 50)
  familynameKana: string;

  @Length(1, 50)
  firstnameKana: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(1, 250)
  email: string;

  @IsNotEmpty()
  @Length(1, 250)
  email_hash: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  accountType: AccountType;

  @IsNotEmpty()
  agreeTerms: string;

  stripeCustomerId: string;
}
