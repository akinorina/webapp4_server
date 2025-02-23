import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { userProviders } from '../users/entities/user.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [StripeController],
  providers: [StripeService, ...userProviders],
})
export class StripeModule {}
