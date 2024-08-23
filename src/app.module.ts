import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SampleLogsModule } from './sample_logs/sample_logs.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ImagesModule } from './images/images.module';
import configuration from './config/configuration';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    AuthModule,
    UsersModule,
    SampleLogsModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
