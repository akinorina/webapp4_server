import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1730858256300 implements MigrationInterface {
  name = 'User1730858256300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`agreeTerms\` tinyint NOT NULL COMMENT '利用規約への同意' DEFAULT '0' AFTER \`password\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`agreeTerms\``);
  }
}
