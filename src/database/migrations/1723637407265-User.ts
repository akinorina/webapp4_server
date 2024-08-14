import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1723637407265 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO \`user\` (\`id\`, \`username\`, \`familyname\`, \`firstname\`, \`familynameKana\`, \`firstnameKana\`, \`email\`, \`password\`, \`createdAt\`, \`updatedAt\`, \`deletedAt\`) VALUES (NULL, 'admin', 'システム', '管理者', 'しすてむ', 'かんりしゃ', 'admin@example.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', '2024-08-14 21:22:24.000000', '2024-08-14 21:22:24.000000', NULL)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM \`user\` WHERE \`user\`.\`username\` = 'admin'`,
    );
  }
}
