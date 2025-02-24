import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as dayjs from 'dayjs';
import * as nunjucks from 'nunjucks';
import { createTransport, Transporter } from 'nodemailer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyingEmailDto } from './dto/verifying-email.dto';
import { CheckVerifyingEmailDto } from './dto/check-verifying-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RegisterUserNormalDto } from './dto/register-user-normal.dto';
import { Repository, Raw, IsNull } from 'typeorm';
import { User } from './entities/user.entity';
import { VerifyingEmail } from './entities/verify-email.entity';
import { Role } from 'src/roles/entities/role.entity';
import { ERoles } from 'src/enumerates/roles.enum';
import configuration from 'src/config/configuration';

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

nunjucks.configure('views', { autoescape: true });

@Injectable()
export class UsersService {
  smtpConfig: SmtpConfig;
  transporter: Transporter;

  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject('ROLE_REPOSITORY')
    private roleRepository: Repository<Role>,
    @Inject('VERIFYING_EMAIL_REPOSITORY')
    private verifyingEmailRepository: Repository<VerifyingEmail>,
  ) {
    this.smtpConfig = configuration().smtp;
    this.transporter = createTransport(this.smtpConfig);
  }

  // ユーザー作成
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
      return await this.userRepository.findOneOrFail({
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

  async findOneByEmail(email: string, withDeleted: boolean = false) {
    try {
      return await this.userRepository.findOne({
        withDeleted: withDeleted,
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
    const targetUser = new User();
    targetUser.setValueByUpdateUserDto(updateUserDto);
    return await this.userRepository.update(id, targetUser);
  }

  async updatePatch(id: number, updateUserDto: UpdateUserDto) {
    const targetUser = await this.findOne(id);
    targetUser.setValueByUpdateUserDto(updateUserDto);
    return await this.userRepository.update(id, targetUser);
  }

  async remove(id: number) {
    const targetUser = await this.userRepository.findOneByOrFail({ id: id });

    // email に日付を追記
    targetUser.email =
      targetUser.email + '-' + dayjs().format('YYYYMMDDHHmmss');
    await this.userRepository.update(id, targetUser);

    return await this.userRepository.softDelete(id);
  }

  // パスワード更新
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

  // verify-email - 確認メール送信
  async sendVerifyingEmail(verifyingEmailDto: VerifyingEmailDto) {
    // data
    const sendVerifyingEmailData = {
      'sign-up': {
        next_url_path: '/signup-input',
        email_title: 'Webapp4 ユーザー登録',
        path_verifyemail_admin_text: 'sign-up/verify_email.to-admin.text.njk',
        path_verifyemail_admin_html: 'sign-up/verify_email.to-admin.html.njk',
        path_verifyemail_user_text: 'sign-up/verify_email.to-user.text.njk',
        path_verifyemail_user_html: 'sign-up/verify_email.to-user.html.njk',
      },
      'reset-password': {
        next_url_path: '/reset-password-input',
        email_title: 'Webapp4 パスワード初期化',
        path_verifyemail_admin_text:
          'reset-password/verify_email.to-admin.text.njk',
        path_verifyemail_admin_html:
          'reset-password/verify_email.to-admin.html.njk',
        path_verifyemail_user_text:
          'reset-password/verify_email.to-user.text.njk',
        path_verifyemail_user_html:
          'reset-password/verify_email.to-user.html.njk',
      },
    };
    // action
    const action = verifyingEmailDto.action;

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
    //  - .env : APP_ORIGIN
    //  - @Body: next_url_path
    //
    const nextURL =
      configuration().app.origin +
      sendVerifyingEmailData[action].next_url_path +
      '?email=' +
      encodeURI(savedData.email) +
      '&hash=' +
      encodeURIComponent(savedData.hash);

    const options = {
      email: savedData.email,
      url: nextURL,
      date: dayjs().format('YYYY-MM-DD'),
    };

    // メール作成
    const toAdminText = nunjucks.render(
      sendVerifyingEmailData[action].path_verifyemail_admin_text,
      options,
    );
    const toAdminHtml = nunjucks.render(
      sendVerifyingEmailData[action].path_verifyemail_admin_html,
      options,
    );
    // メール送信 to admin.
    await this.transporter.sendMail({
      from: configuration().app.system.email_address,
      to: configuration().app.admin.email_address,
      subject: sendVerifyingEmailData[action].email_title,
      text: toAdminText,
      html: toAdminHtml,
    });

    // メール作成
    const touserText = nunjucks.render(
      sendVerifyingEmailData[action].path_verifyemail_user_text,
      options,
    );
    const toUserHtml = nunjucks.render(
      sendVerifyingEmailData[action].path_verifyemail_user_html,
      options,
    );
    // メール送信 to user.
    await this.transporter.sendMail({
      from: configuration().app.system.email_address,
      to: savedData.email,
      subject: sendVerifyingEmailData[action].email_title,
      text: touserText,
      html: toUserHtml,
    });

    // hash値などをレスポンス
    return {
      message: 'sendVerifyingEmail() ... success',
      hash: savedData.hash,
    };
  }

  // verify-email - メールアドレス検証
  async checkVerifyingEmail(checkVerifyingEmailDto: CheckVerifyingEmailDto) {
    // check verifying email.
    try {
      await this.verifyingEmailRepository.findOneOrFail({
        where: {
          email: checkVerifyingEmailDto.email,
          hash: checkVerifyingEmailDto.hash,
          createdAt: Raw(
            (cat) => `DATE_ADD(${cat}, INTERVAL 120 MINUTE) > NOW()`,
          ),
          verifiedEmailAt: IsNull(),
        },
        order: {
          createdAt: 'DESC',
          id: 'DESC',
        },
      });
    } catch (error) {
      throw new HttpException('invalid email-address.', HttpStatus.BAD_REQUEST);
    }

    return { result: 'valid' };
  }

  // Sign-up - ユーザー新規登録
  async registerUser(registerUserNormalDto: RegisterUserNormalDto) {
    // Email, Hash値 照合
    const targetVerifyingEmail = await this.verifyingEmailRepository.findOne({
      where: {
        email: registerUserNormalDto.email,
        hash: registerUserNormalDto.email_hash,
        createdAt: Raw(
          (cat) => `DATE_ADD(${cat}, INTERVAL 120 MINUTE) > NOW()`,
        ),
        verifiedEmailAt: IsNull(),
      },
      order: {
        createdAt: 'DESC',
        id: 'DESC',
      },
    });
    if (!targetVerifyingEmail) {
      throw new HttpException('invalid email', HttpStatus.BAD_REQUEST);
    }

    // verifying email - メール確認日時 更新
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
    user.setValueByRegisterUserNormalDto(registerUserNormalDto);
    user.verifying_email = verifiedEmail;
    user.roles = [role];
    const resultUser = this.userRepository.save(user);

    return resultUser;
  }

  // reset-password - パスワード更新 処理
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // verifying email から検索
    // Email, Hash値 照合
    const targetVerifyingEmail = await this.verifyingEmailRepository.findOne({
      where: {
        email: resetPasswordDto.email,
        hash: resetPasswordDto.hash,
        createdAt: Raw(
          (cat) => `DATE_ADD(${cat}, INTERVAL 120 MINUTE) > NOW()`,
        ),
        verifiedEmailAt: IsNull(),
      },
      order: {
        createdAt: 'DESC',
        id: 'DESC',
      },
    });
    if (!targetVerifyingEmail) {
      throw new HttpException('invalid email', HttpStatus.BAD_REQUEST);
    }

    // verifying email - メール確認日時 更新
    targetVerifyingEmail.verifiedEmailAt = dayjs().format(
      'YYYY-MM-DD HH:mm:ss.ssssss',
    );
    const verifiedEmail =
      await this.verifyingEmailRepository.save(targetVerifyingEmail);

    // 該当ユーザー取得
    const targetUser = await this.userRepository.findOne({
      where: {
        email: verifiedEmail.email,
      },
    });

    // パスワード更新
    targetUser.password = resetPasswordDto.password;
    await this.userRepository.save(targetUser);

    return { message: 'success' };
  }

  /**
   * テストメールを送信
   * @returns {}
   */
  async sendTestMail() {
    // send a mail.
    await this.transporter.sendMail({
      from: '"foo" <foo@gmail.com>',
      to: '"bar" <bar@gmail.com>',
      subject: 'Hello ✔',
      text: 'Hello world?',
      html: '<b>Hello world?</b>',
    });

    return { name: 'send_test_mail', status: 'success' };
  }
}
