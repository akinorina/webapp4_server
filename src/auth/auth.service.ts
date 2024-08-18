import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { console } from 'src/log/logger';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
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

  async googleSignIn(req) {
    console.debug('--- googleSignIn() ---');
    if (!req.user) {
      return 'No user from google';
    }
    console.debug('req.user', req.user);

    // search the user on DB.
    let targetUser = await this.usersService.findOneByEmail(req.user.email);
    console.debug('---');
    console.debug('targetUser', targetUser);

    if (!targetUser) {
      const newUserDto = new CreateUserDto();
      newUserDto.username = req.user.username;
      newUserDto.familyname = req.user.familyname;
      newUserDto.firstname = req.user.firstname;
      newUserDto.email = req.user.email;
      newUserDto.password = 'webapp4';
      targetUser = await this.usersService.create(newUserDto);
    }
    console.debug('targetUser', targetUser);

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
