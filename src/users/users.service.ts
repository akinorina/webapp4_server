import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { ERoles } from 'src/roles/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject('ROLE_REPOSITORY')
    private roleRepository: Repository<Role>,
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
}
