import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class alterStatementsEnum1673912955457 implements MigrationInterface {

public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(
      `ALTER TYPE "statements_type_enum" ADD VALUE 'transfer' AFTER 'withdraw'`,
  )
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(
      `ALTER TYPE "statements_type_enum" DROP VALUE 'transfer' AFTER 'withdraw'`,
  )
}

}
