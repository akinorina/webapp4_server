import { Module } from '@nestjs/common';
import { LogoutputsController } from './logoutputs.controller';

@Module({
  controllers: [LogoutputsController],
})
export class LogoutputsModule {}
