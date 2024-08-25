import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class VerifyingEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 250)
  email: string;
}
