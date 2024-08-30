import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    @Inject('BLOG_REPOSITORY')
    private blogRepository: Repository<Blog>,
  ) {}

  create(createBlogDto: CreateBlogDto) {
    return this.blogRepository.save(createBlogDto);
  }

  findAll() {
    return this.blogRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.blogRepository.findOneByOrFail({ id: id });
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    try {
      return await this.blogRepository.update(id, updateBlogDto);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  remove(id: number) {
    return this.blogRepository.softDelete(id);
  }
}
