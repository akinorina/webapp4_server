import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as dayjs from 'dayjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyingEmailDto } from './dto/verifying-email.dto';
import { Repository, Raw } from 'typeorm';
import { User } from './entities/user.entity';
import { VerifyingEmail } from './entities/verify-email.entity';
import { Role } from 'src/roles/entities/role.entity';
import { ERoles } from 'src/enumerates/roles.enum';
import { console } from 'src/log/logger';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject('ROLE_REPOSITORY')
    private roleRepository: Repository<Role>,
    @Inject('VERIFYING_EMAIL_REPOSITORY')
    private verifyingEmailRepository: Repository<VerifyingEmail>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new User();
    newUser.setValueByCreateUserDto(createUserDto);

    // set Role as 'user'
    const role = await this.roleRepository.findOne({
      where: { name: ERoles.User },
    });
    newUser.roles = [role];

    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.userRepository.findOneByOrFail({ id: id });
    } catch (err) {
      throw new HttpException('not found.', HttpStatus.NOT_FOUND);
    }
  }

  async findOneByUsername(username: string) {
    try {
      return await this.userRepository.findOne({
        where: {
          username: username,
        },
        relations: {
          roles: true,
        },
      });
    } catch (err) {
      throw new HttpException('not found.', HttpStatus.NOT_FOUND);
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.userRepository.findOne({
        where: {
          email: email,
        },
        relations: {
          roles: true,
        },
      });
    } catch (err) {
      throw new HttpException('not found.', HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.softDelete(id);
  }

  async changePassword(user: any, changePasswordDto: ChangePasswordDto) {
    // find the target User data.
    const targetUser = await this.userRepository.findOne({
      where: {
        id: user.id,
        username: user.username,
        password: changePasswordDto.oldPassword,
      },
    });

    // 該当データなしの場合はERROR
    if (!targetUser) {
      throw new HttpException('no user.', HttpStatus.BAD_REQUEST);
    }

    // change password
    targetUser.password = changePasswordDto.newPassword;
    return await this.userRepository.update(user.id, targetUser);
  }

  async verifyingEmail(verifyingEmailDto: VerifyingEmailDto) {
    // hash作成
    const targetValue =
      verifyingEmailDto.email + dayjs().format('YYYYMMDDHHmmss');
    const salt = bcrypt.genSaltSync(10);
    const targetHash = bcrypt.hashSync(targetValue, salt);

    // DB登録
    const verifyingEmailData = {
      email: verifyingEmailDto.email,
      hash: targetHash,
      verifiedEmailAt: null,
    };
    const savedData =
      await this.verifyingEmailRepository.save(verifyingEmailData);

    // make a URL.
    const nextURL =
      'http://localhost:4000' +
      '/signup-register-info?email=' +
      encodeURI(savedData.email) +
      '&hash=' +
      encodeURIComponent(savedData.hash);
    console.debug('nextURL', nextURL);

    // メール作成
    //  - メールアドレス
    //  - hash
    //  - 次のURL

    // メール送信

    // hash値などをレスポンス
    return { hash: savedData.hash };
  }

  async registerUser(createUserDto: CreateUserDto) {
    // Email, Hash値 照合
    const targetVerifyingEmail = await this.verifyingEmailRepository.findOne({
      where: {
        email: createUserDto.email,
        hash: createUserDto.email_hash,
        createdAt: Raw((cat) => `DATE_ADD(${cat}, INTERVAL 2 DAY) > NOW()`),
      },
      order: {
        createdAt: 'DESC',
        id: 'DESC',
      },
    });
    if (!targetVerifyingEmail) {
      throw new HttpException('invalid email', HttpStatus.BAD_REQUEST);
    }

    // User 登録
    targetVerifyingEmail.verifiedEmailAt = dayjs().format(
      'YYYY-MM-DD HH:mm:ss.ssssss',
    );
    const verifiedEmail =
      await this.verifyingEmailRepository.save(targetVerifyingEmail);

    // set Role as 'user'
    const role = await this.roleRepository.findOne({
      where: { name: ERoles.User },
    });

    // User 登録
    const user = new User();
    user.setValueByCreateUserDto(createUserDto);
    user.verifying_email = verifiedEmail;
    user.roles = [role];
    const resultUser = this.userRepository.save(user);

    return resultUser;
  }
}
