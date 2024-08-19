/**
 * Image data entity
 *
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number = 0;

  @Column({ default: '', comment: '画像表示名' })
  name: string = '';

  @Column({ default: '', comment: 'Bucket名' })
  bucket: string = '';

  @Column({ default: '', comment: 'オブジェクトキー' })
  objectKey: string = '';

  @Column({ default: '', comment: 'PATH' })
  path: string = '';

  @CreateDateColumn({ comment: '作成日時' })
  createdAt: string | undefined = undefined;

  @UpdateDateColumn({ comment: '更新日時' })
  updatedAt: string | undefined = undefined;

  @DeleteDateColumn({ comment: '削除日時' })
  deletedAt: string | undefined = undefined;
}
