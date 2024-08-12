import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(1, 10)
  familyname: string;

  @IsNotEmpty()
  @Length(1, 10)
  firstname: string;

  @IsNotEmpty()
  @Length(1, 50)
  familynameKana: string;

  @IsNotEmpty()
  @Length(1, 50)
  firstnameKana: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(1, 250)
  email: string;

  @IsNotEmpty()
  password: string;
}
