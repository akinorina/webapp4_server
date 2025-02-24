import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1740308740403 implements MigrationInterface {
  name = 'User1740308740403';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`stripeCustomerId\` varchar(255) NOT NULL COMMENT 'Stripe Customer Id' DEFAULT '' AFTER \`agreeTerms\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`stripeCustomerId\``,
    );
  }
}
