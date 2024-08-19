import { Module } from '@nestjs/common';
import { roleProviders } from './entities/role.providers';
import { RolesService } from './roles.service';
import { DatabaseModule } from 'src/database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...roleProviders,
    RolesService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [RolesService],
})
export class RolesModule {}
