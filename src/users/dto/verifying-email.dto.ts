import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class VerifyingEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 250)
  email: string;

  // emailアドレス確認後のアクション
  // 'sign-up'       : ユーザー登録時
  // 'reset-password': パスワードリセット時
  @IsNotEmpty()
  @Length(1, 250)
  action: 'sign-up' | 'reset-password';
}
