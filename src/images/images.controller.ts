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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ERoles } from 'src/roles/roles.enum';
import { Roles } from 'src/roles/roles.decorator';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Roles([ERoles.User])
  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imagesService.create(createImageDto);
  }

  @Roles([ERoles.User])
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { dest: 'uploads/' }))
  upload(
    @Body() createImageDto: CreateImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.imagesService.upload(createImageDto, file);
  }

  @Roles([ERoles.User])
  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @Roles([ERoles.User])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(+id);
  }

  @Roles([ERoles.User])
  @Put(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(+id, updateImageDto);
  }

  @Roles([ERoles.User])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }

  @Roles([ERoles.User])
  @Post('list-s3')
  listS3() {
    return this.imagesService.listS3();
  }
}
