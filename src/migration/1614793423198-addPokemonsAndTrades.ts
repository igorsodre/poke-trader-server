import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPokemonsAndTrades1614793423198 implements MigrationInterface {
    name = 'addPokemonsAndTrades1614793423198';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "trades" ("id" SERIAL NOT NULL, "status" integer NOT NULL, "requestedPokemons" integer array NOT NULL, "pokemonsSentToMe" integer array NOT NULL, "requesterId" integer, "requestedId" integer, CONSTRAINT "PK_c6d7c36a837411ba5194dc58595" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "pokemons" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "pokeApiId" character varying NOT NULL, "baseExperience" integer NOT NULL, "userId" integer, CONSTRAINT "PK_a3172290413af616d9cfa1fdc9a" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`ALTER TABLE "users" ADD "pokemonsId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "requestedTradesId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "tradesSentToMeId" integer`);
        await queryRunner.query(
            `ALTER TABLE "trades" ADD CONSTRAINT "FK_ebba4c55b8c6cb19b086cd04965" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "trades" ADD CONSTRAINT "FK_e594719b54e15d65ef85f837feb" FOREIGN KEY ("requestedId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_c9fb5800d5c384c3cbe7039d336" FOREIGN KEY ("pokemonsId") REFERENCES "pokemons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_36b4bedc5291b081a716a59bb6e" FOREIGN KEY ("requestedTradesId") REFERENCES "trades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_58b883f6f5683c8baf1677cc9ba" FOREIGN KEY ("tradesSentToMeId") REFERENCES "trades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "pokemons" ADD CONSTRAINT "FK_c0c6b08c6d87d323256cb5759b0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemons" DROP CONSTRAINT "FK_c0c6b08c6d87d323256cb5759b0"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_58b883f6f5683c8baf1677cc9ba"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_36b4bedc5291b081a716a59bb6e"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_c9fb5800d5c384c3cbe7039d336"`);
        await queryRunner.query(`ALTER TABLE "trades" DROP CONSTRAINT "FK_e594719b54e15d65ef85f837feb"`);
        await queryRunner.query(`ALTER TABLE "trades" DROP CONSTRAINT "FK_ebba4c55b8c6cb19b086cd04965"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tradesSentToMeId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "requestedTradesId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "pokemonsId"`);
        await queryRunner.query(`DROP TABLE "pokemons"`);
        await queryRunner.query(`DROP TABLE "trades"`);
    }
}
