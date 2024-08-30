import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { blogProviders } from './entities/blog.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [BlogsController],
  providers: [...blogProviders, BlogsService],
})
export class BlogsModule {}
