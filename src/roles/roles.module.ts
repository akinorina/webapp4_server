import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from 'src/database/database.module';
import { roleProviders } from './entities/role.providers';
import { RolesService } from './roles.service';
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
})
export class RolesModule {}
