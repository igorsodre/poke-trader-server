import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatePokemonTableToAddStats1614810985052 implements MigrationInterface {
    name = 'updatePokemonTableToAddStats1614810985052';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemons" DROP CONSTRAINT "FK_c0c6b08c6d87d323256cb5759b0"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_c9fb5800d5c384c3cbe7039d336"`);
        await queryRunner.query(
            `CREATE TABLE "users_pokemons_pokemons" ("usersId" integer NOT NULL, "pokemonsId" integer NOT NULL, CONSTRAINT "PK_f4bc246eaef14b3a2af7f2d16b3" PRIMARY KEY ("usersId", "pokemonsId"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_347130834a95292bc92f95eda1" ON "users_pokemons_pokemons" ("usersId") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_186672f1f8a7bc81e034438415" ON "users_pokemons_pokemons" ("pokemonsId") `,
        );
        await queryRunner.query(`ALTER TABLE "pokemons" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "pokemonsId"`);
        await queryRunner.query(`ALTER TABLE "pokemons" ADD "height" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemons" ADD "weight" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemons" ADD "species" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemons" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "pokemons" ADD "name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemons" DROP COLUMN "pokeApiId"`);
        await queryRunner.query(`ALTER TABLE "pokemons" ADD "pokeApiId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying(50) NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "users_pokemons_pokemons" ADD CONSTRAINT "FK_347130834a95292bc92f95eda15" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "users_pokemons_pokemons" ADD CONSTRAINT "FK_186672f1f8a7bc81e034438415d" FOREIGN KEY ("pokemonsId") REFERENCES "pokemons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users_pokemons_pokemons" DROP CONSTRAINT "FK_186672f1f8a7bc81e034438415d"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users_pokemons_pokemons" DROP CONSTRAINT "FK_347130834a95292bc92f95eda15"`,
        );
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemons" DROP COLUMN "pokeApiId"`);
        await queryRunner.query(`ALTER TABLE "pokemons" ADD "pokeApiId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemons" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "pokemons" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemons" DROP COLUMN "species"`);
        await queryRunner.query(`ALTER TABLE "pokemons" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "pokemons" DROP COLUMN "height"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "pokemonsId" integer`);
        await queryRunner.query(`ALTER TABLE "pokemons" ADD "userId" integer`);
        await queryRunner.query(`DROP INDEX "IDX_186672f1f8a7bc81e034438415"`);
        await queryRunner.query(`DROP INDEX "IDX_347130834a95292bc92f95eda1"`);
        await queryRunner.query(`DROP TABLE "users_pokemons_pokemons"`);
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_c9fb5800d5c384c3cbe7039d336" FOREIGN KEY ("pokemonsId") REFERENCES "pokemons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "pokemons" ADD CONSTRAINT "FK_c0c6b08c6d87d323256cb5759b0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
