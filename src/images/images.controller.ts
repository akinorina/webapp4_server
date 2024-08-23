import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Put,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ERoles } from 'src/roles/roles.enum';
import { Roles } from 'src/roles/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Roles([ERoles.User])
  @Post()
  create(@Request() req, @Body() createImageDto: CreateImageDto) {
    return this.imagesService.create(req, createImageDto);
  }

  @Roles([ERoles.User])
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { dest: 'uploads/' }))
  upload(
    @Request() req,
    @Body() createImageDto: CreateImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.imagesService.upload(req, createImageDto, file);
  }

  @Public()
  @Get()
  findAll(@Request() req) {
    return this.imagesService.findAll(req);
  }

  @Roles([ERoles.User])
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.imagesService.findOne(req, +id);
  }

  @Roles([ERoles.User])
  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    return this.imagesService.update(req, +id, updateImageDto);
  }

  @Roles([ERoles.User])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }
}
