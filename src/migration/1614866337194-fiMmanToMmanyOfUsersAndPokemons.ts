import {MigrationInterface, QueryRunner} from "typeorm";

export class fiMmanToMmanyOfUsersAndPokemons1614866337194 implements MigrationInterface {
    name = 'fiMmanToMmanyOfUsersAndPokemons1614866337194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_pokemons" ("id" SERIAL NOT NULL, CONSTRAINT "PK_6d55d403210e0f141a18d79d387" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "userPokemonsId" integer`);
        await queryRunner.query(`ALTER TABLE "pokemons" ADD "userPokemonsId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_8bf4d85eca02d159adf9c170c1a" FOREIGN KEY ("userPokemonsId") REFERENCES "users_pokemons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pokemons" ADD CONSTRAINT "FK_25bf83a7b020c34a1a6f72e29a0" FOREIGN KEY ("userPokemonsId") REFERENCES "users_pokemons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemons" DROP CONSTRAINT "FK_25bf83a7b020c34a1a6f72e29a0"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_8bf4d85eca02d159adf9c170c1a"`);
        await queryRunner.query(`ALTER TABLE "pokemons" DROP COLUMN "userPokemonsId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userPokemonsId"`);
        await queryRunner.query(`DROP TABLE "users_pokemons"`);
    }

}
