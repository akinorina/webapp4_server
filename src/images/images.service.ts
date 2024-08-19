import { Injectable, Inject } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import {
  S3Client,
  S3ClientConfig,
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'node:path';
import * as dayjs from 'dayjs';
import configuration from 'src/config/configuration';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ImagesService {
  s3ClientConfig: S3ClientConfig = {
    region: configuration().storage.region,
    endpoint: configuration().storage.endpoint,
    forcePathStyle: configuration().storage.forcePathStyle,
    credentials: {
      accessKeyId: configuration().storage.accessKeyId,
      secretAccessKey: configuration().storage.secretAccessKey,
    },
  };
  s3client = new S3Client(this.s3ClientConfig);
  bucketName = configuration().storage.bucketName;
  keyPrefix = 'images';

  constructor(
    @Inject('IMAGE_REPOSITORY')
    private imageRepository: Repository<Image>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async create(user: any, createImageDto: CreateImageDto) {
    const fileName =
      path.parse(createImageDto.originalname).name +
      dayjs().format('_YYYYMMDDHHmmss') +
      path.parse(createImageDto.originalname).ext;
    const objectKey = this.keyPrefix + '/' + fileName;
    const imagePath = '/' + this.bucketName + '/' + objectKey;

    // 画像データ(Base64)をデコード
    const base64Data = createImageDto.data;
    const fileData = base64Data.replace(/^data:\w+\/\w+;base64,/, '');
    const decodedFile = Buffer.from(fileData, 'base64');

    // Object Strage へ書き込み
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
      Body: decodedFile,
      ContentType: createImageDto.mimetype,
    });
    await this.s3client.send(command);

    // User
    const targetUser = await this.userRepository.findOneByOrFail({
      id: user.id,
    });

    // DBへデータ登録
    const imageData = {
      name: createImageDto.name,
      bucket: this.bucketName,
      objectKey: objectKey,
      path: imagePath,
      user: targetUser,
    };
    return await this.imageRepository.save(imageData);
  }

  async upload(createImageDto: CreateImageDto, file: Express.Multer.File) {
    const fileName =
      path.parse(file.originalname).name +
      dayjs().format('_YYYYMMDDHHmmss') +
      path.parse(file.originalname).ext;
    const objectKey = this.keyPrefix + '/' + fileName;
    const imagePath = '/' + this.bucketName + '/' + objectKey;

    // アップロードファイル読み込み
    const readStream = fs.createReadStream(file.path);
    try {
      // Object Strage へ書き込み
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
        Body: readStream,
        ContentType: file.mimetype,
      });
      await this.s3client.send(command);
    } catch (error) {
      throw error;
    } finally {
      readStream.close();

      // DBへデータ登録
      createImageDto.bucket = this.bucketName;
      createImageDto.objectKey = objectKey;
      createImageDto.path = imagePath;
      return await this.imageRepository.save(createImageDto);
    }
  }

  async findAll() {
    return await this.imageRepository.find();
  }

  async findOne(id: number) {
    return await this.imageRepository.findOneByOrFail({ id: id });
  }

  async update(id: number, updateImageDto: UpdateImageDto) {
    const imageData = await this.imageRepository.findOneByOrFail({ id: id });

    // update the target DB data.
    const updateData = {
      id: id,
      name: updateImageDto.name,
      bucket: imageData.bucket,
      objectKey: imageData.objectKey,
      path: imageData.path,
    };
    return this.imageRepository.update(id, updateData);
  }

  async remove(id: number) {
    // remove the target object
    const imageData = await this.imageRepository.findOneBy({ id: id });
    if (imageData) {
      const command3 = new DeleteObjectCommand({
        Bucket: imageData.bucket,
        Key: imageData.objectKey,
      });
      await this.s3client.send(command3);
    }
    // softdelete the target DB data.
    return this.imageRepository.softDelete(id);
  }
}
