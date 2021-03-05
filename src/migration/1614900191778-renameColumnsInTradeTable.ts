import {MigrationInterface, QueryRunner} from "typeorm";

export class renameColumnsInTradeTable1614900191778 implements MigrationInterface {
    name = 'renameColumnsInTradeTable1614900191778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trades" RENAME COLUMN "pokemonsSentToMe" TO "pokemonsSentToRequestedUser"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trades" RENAME COLUMN "pokemonsSentToRequestedUser" TO "pokemonsSentToMe"`);
    }

}
