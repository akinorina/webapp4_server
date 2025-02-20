import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyingEmailDto } from './dto/verifying-email.dto';
import { CheckVerifyingEmailDto } from './dto/check-verifying-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RegisterUserNormalDto } from './dto/register-user-normal.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { ERoles } from 'src/enumerates/roles.enum';
import { Public } from 'src/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * ユーザー作成
   * @param createUserDto ユーザー情報
   * @returns APIレスポンス
   */
  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  /**
   * ユーザー一覧
   * @returns ユーザー一覧
   */
  @Roles([ERoles.Admin])
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  /**
   * ユーザー情報 取得
   * @param id ユーザーID
   * @returns ユーザー情報
   */
  @Roles([ERoles.Admin])
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  /**
   * ユーザー情報 更新
   * @param id ユーザーID
   * @param updateUserDto
   * @returns APIレスポンス
   */
  @Roles([ERoles.Admin])
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(+id, updateUserDto);
  }

  /**
   * ユーザー情報 削除
   * @param id ユーザーID
   * @returns APIレスポンス
   */
  @Roles([ERoles.Admin])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }

  /**
   * パスワード変更
   * @param req リクエストデータ
   * @param changePasswordDto パスワード情報
   * @returns APIレスポンス
   */
  @Roles([ERoles.Admin, ERoles.User])
  @Put('change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.usersService.changePassword(req.user, changePasswordDto);
  }

  /**
   * メール確認
   * @param verifyingEmailDto
   * @returns APIレスポンス
   */
  @Public()
  @Post('send-verifying-email')
  async sendVerifyingEmail(@Body() verifyingEmailDto: VerifyingEmailDto) {
    return await this.usersService.sendVerifyingEmail(verifyingEmailDto);
  }

  /**
   * メール確認
   * @param checkVerifyingEmailDto
   * @returns APIレスポンス
   */
  @Public()
  @Post('check-verifying-email')
  async checkVerifyingEmail(
    @Body() checkVerifyingEmailDto: CheckVerifyingEmailDto,
  ) {
    return await this.usersService.checkVerifyingEmail(checkVerifyingEmailDto);
  }

  /**
   * ユーザー登録
   * @param createUserDto
   * @returns APIレスポンス
   */
  @Public()
  @Post('register-user')
  async registerUser(@Body() registerUserNormalDto: RegisterUserNormalDto) {
    return await this.usersService.registerUser(registerUserNormalDto);
  }

  /**
   * パスワードリセット
   * @param resetPasswordDto
   * @returns APIレスポンス
   */
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.usersService.resetPassword(resetPasswordDto);
  }

  /**
   * メール送信テスト
   * @returns APIレスポンス { name: 'send_test_mail', status: 'success'}
   */
  @Public()
  @Post('send_test_mail')
  async sendTestMail() {
    return await this.usersService.sendTestMail();
  }
}
