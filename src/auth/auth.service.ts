import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, createdAt, updatedAt, deletedAt, ...result } = user;
      return result;
    }
    return null;
  }

  async signIn(user: any) {
    const roles = user.roles.map((item) => {
      return item.name;
    });
    const payload = { username: user.username, sub: user.id, roles: roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signOut() {
    return { access_token: null };
  }

  // async signInGoogle(req: any) {
  //   if (!req.user) {
  //     return 'No user from google';
  //   }
  //   console.debug('req.user', req.user);

  //   // search the user on DB.
  //   let targetUser = await this.usersService.findOneByEmail(req.user.email);
  //   if (!targetUser) {
  //     // create new user from google-auth data.
  //     const newUserDto = new CreateUserDto();
  //     newUserDto.username = req.user.username;
  //     newUserDto.familyname = req.user.familyname;
  //     newUserDto.firstname = req.user.firstname;
  //     newUserDto.email = req.user.email;
  //     newUserDto.password = '';
  //     targetUser = await this.usersService.create(newUserDto);
  //   }

  //   // create and return the access token.
  //   const roles = targetUser.roles.map((item) => {
  //     return item.name;
  //   });
  //   const payload = {
  //     username: targetUser.username,
  //     sub: targetUser.id,
  //     roles: roles,
  //   };
  //   return this.jwtService.sign(payload);
  // }
}
