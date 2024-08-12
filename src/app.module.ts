import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LogoutputsModule } from './logoutputs/logoutputs.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    UsersModule,
    LogoutputsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
