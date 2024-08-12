/**
 * User data entity
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
export class User {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number = 0;

  @Column({ default: '', comment: '姓' })
  familyname: string = '';

  @Column({ default: '', comment: '名' })
  firstname: string = '';

  @Column({ default: '', comment: '姓かな' })
  familynameKana: string = '';

  @Column({ default: '', comment: '名かな' })
  firstnameKana: string = '';

  @Column({ default: '', comment: 'メールアドレス' })
  email: string = '';

  @Column({ default: '', comment: 'パスワード' })
  password: string = '';

  @CreateDateColumn({ comment: '作成日時' })
  createdAt: string | undefined = undefined;

  @UpdateDateColumn({ comment: '更新日時' })
  updatedAt: string | undefined = undefined;

  @DeleteDateColumn({ comment: '削除日時' })
  deletedAt: string | undefined = undefined;
}
