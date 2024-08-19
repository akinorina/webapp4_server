import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { imageProviders } from './entities/image.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ImagesController],
  providers: [...imageProviders, ImagesService],
})
export class ImagesModule {}
