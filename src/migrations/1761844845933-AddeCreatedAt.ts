import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddeCreatedAt1761844845933 implements MigrationInterface {
  name = 'AddeCreatedAt1761844845933';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tags" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "createdAt"`);
  }
}
