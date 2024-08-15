import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './entities/user.providers';
import { roleProviders } from 'src/roles/entities/role.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [...userProviders, UsersService, ...roleProviders],
  exports: [UsersService],
})
export class UsersModule {}
