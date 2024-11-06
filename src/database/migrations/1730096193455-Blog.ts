import { MigrationInterface, QueryRunner } from 'typeorm';

export class Blog1730096193455 implements MigrationInterface {
  name = 'Blog1730096193455';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`blog\` ADD \`blogAt\` datetime NULL COMMENT 'blog表示日時' AFTER \`subject\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` DROP FOREIGN KEY \`FK_fc46ede0f7ab797b7ffacb5c08d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` CHANGE \`userId\` \`userId\` int NULL COMMENT 'ID'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` ADD CONSTRAINT \`FK_fc46ede0f7ab797b7ffacb5c08d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`blog\` DROP FOREIGN KEY \`FK_fc46ede0f7ab797b7ffacb5c08d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` CHANGE \`userId\` \`userId\` int NULL COMMENT 'ユーザーID'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` ADD CONSTRAINT \`FK_fc46ede0f7ab797b7ffacb5c08d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`blogAt\``);
  }
}
