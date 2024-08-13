import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1723540429492 implements MigrationInterface {
  name = 'User1723540429492';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`username\` varchar(255) NOT NULL COMMENT 'ユーザー名' DEFAULT '' AFTER \`id\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`username\``);
  }
}
