import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1723709112435 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO \`user\`(\`id\`, \`username\`, \`familyname\`, \`firstname\`, \`familynameKana\`, \`firstnameKana\`, \`email\`, \`password\`, \`createdAt\`, \`updatedAt\`, \`deletedAt\`) VALUES(\'1\', \'admin\', \'システム\', \'管理者\', \'しすてむ\', \'かんりしゃ\', \'admin@example.com\', \'b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342\', \'2024-08-15 00:00:00.000000\', \'2024-08-15 00:00:00.000000\', NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO \`user_roles_role\` (\`userId\`, \`roleId\`) VALUES (\'1\', \'1\'), (\'1\', \'2\');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM \`user_roles_role\` WHERE \`userId\` IN (\'1\')`,
    );
    await queryRunner.query(`DELETE FROM \`user\` WHERE \`id\` = 1`);
  }
}
