import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BlogsService {
  constructor(
    @Inject('BLOG_REPOSITORY')
    private blogRepository: Repository<Blog>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async create(req: any, createBlogDto: CreateBlogDto) {
    // User
    const targetUser = await this.userRepository.findOneByOrFail({
      id: req.user.id,
    });

    const blogData = {
      subject: createBlogDto.subject,
      blogAt: createBlogDto.blogAt,
      body: createBlogDto.body,
      user: targetUser,
    };
    return this.blogRepository.save(blogData);
  }

  async findAll(req: any, queries: any) {
    const options: any = {
      relations: { user: true },
      where: { body: null, user: null },
      order: {},
    };

    // conditions
    if (queries.q) {
      options.where = { body: Like('%' + queries.q + '%') };
    }
    if (req.user) {
      options.where = { user: { id: req.user.id } };
    }
    // order by
    if (queries.orders) {
      const ords = queries.orders.split(',');
      ords.forEach((ordItem) => {
        const ord = ordItem.split(':');
        options.order[ord[0]] = ord[1];
      });
    }

    return await this.blogRepository.find(options);
  }

  async findOne(req: any, id: number) {
    try {
      // prev_id & next_id
      const queries = { orders: 'desc' };
      const blogList = await this.findAll(req, queries);
      const aryList = blogList.map((item) => {
        return item.id;
      });
      const maxIndex = aryList.length - 1;
      const targetIndex = aryList.findIndex((item) => {
        return item === id;
      });
      const prevId = targetIndex <= 0 ? -1 : aryList[targetIndex - 1];
      const nextId = targetIndex >= maxIndex ? -1 : aryList[targetIndex + 1];

      const options: any = {
        relations: { user: true },
        where: { id: id },
      };
      if (req.user) {
        options.where.user = { id: req.user.id };
      }
      const targetBlog: any = await this.blogRepository.findOneOrFail(options);
      targetBlog.prevId = prevId;
      targetBlog.nextId = nextId;
      return targetBlog;
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async update(req: any, id: number, updateBlogDto: UpdateBlogDto) {
    try {
      // User
      const targetUser = await this.userRepository.findOneByOrFail({
        id: req.user.id,
      });

      // update the target DB data.
      const updateData = {
        id: id,
        subject: updateBlogDto.subject,
        blogAt: updateBlogDto.blogAt,
        body: updateBlogDto.body,
        user: targetUser,
      };
      return await this.blogRepository.update(id, updateData);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  remove(id: number) {
    return this.blogRepository.softDelete(id);
  }
}
