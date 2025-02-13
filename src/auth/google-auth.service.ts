import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class GoogleAuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signInGoogle(req: any) {
    // return 'no_user_from_google';
    if (!req.user) {
      return 'no_user_from_google';
    }

    // emailによるユーザー検索
    let targetUser = await this.usersService.findOneByEmail(req.user.email);
    if (!targetUser) {
      // email見つからない => ユーザー新樹登録: DBにユーザーを作成

      // 削除済みを含めてemailによるユーザー検索
      const targetUserDeleted = await this.usersService.findOneByEmail(
        req.user.email,
        true,
      );
      if (targetUserDeleted) {
        // 一度不正で削除処理したユーザーの場合
        throw new HttpException(
          'このアカウントでの登録はできません' + ' : ' + req.user.email,
          HttpStatus.BAD_REQUEST,
        );
      }

      // google-auth によるサイン-アップ、ユーザー情報をDBに新樹作成
      const newUserDto = new CreateUserDto();
      newUserDto.username = req.user.username;
      newUserDto.familyname = req.user.familyname;
      newUserDto.firstname = req.user.firstname;
      newUserDto.email = req.user.email;
      newUserDto.password = '';
      targetUser = await this.usersService.create(newUserDto);
    }

    // access token 作成
    const roles = targetUser.roles.map((item) => {
      return item.name;
    });
    const payload = {
      username: targetUser.username,
      sub: targetUser.id,
      roles: roles,
    };
    return this.jwtService.sign(payload);
  }
}
