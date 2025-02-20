import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1739605755161 implements MigrationInterface {
  name = 'User1739605755161';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`accountType\` varchar(255) NOT NULL COMMENT 'アカウントタイプ (normal|google)' DEFAULT 'normal' AFTER \`password\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`accountType\``);
  }
}
