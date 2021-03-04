import {MigrationInterface, QueryRunner} from "typeorm";

export class fixmanToMmanyOfUsersAndPokemons21614868637442 implements MigrationInterface {
    name = 'fixmanToMmanyOfUsersAndPokemons21614868637442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_36b4bedc5291b081a716a59bb6e"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_58b883f6f5683c8baf1677cc9ba"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_8bf4d85eca02d159adf9c170c1a"`);
        await queryRunner.query(`ALTER TABLE "pokemons" DROP CONSTRAINT "FK_25bf83a7b020c34a1a6f72e29a0"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "requestedTradesId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tradesSentToMeId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userPokemonsId"`);
        await queryRunner.query(`ALTER TABLE "pokemons" DROP COLUMN "userPokemonsId"`);
        await queryRunner.query(`ALTER TABLE "users_pokemons" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "users_pokemons" ADD "pokemonId" integer`);
        await queryRunner.query(`ALTER TABLE "users_pokemons" ADD CONSTRAINT "FK_576c5d6475f397b4a24cf58e6be" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_pokemons" ADD CONSTRAINT "FK_eb025b13aee5e0ce5a745196305" FOREIGN KEY ("pokemonId") REFERENCES "pokemons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_pokemons" DROP CONSTRAINT "FK_eb025b13aee5e0ce5a745196305"`);
        await queryRunner.query(`ALTER TABLE "users_pokemons" DROP CONSTRAINT "FK_576c5d6475f397b4a24cf58e6be"`);
        await queryRunner.query(`ALTER TABLE "users_pokemons" DROP COLUMN "pokemonId"`);
        await queryRunner.query(`ALTER TABLE "users_pokemons" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "pokemons" ADD "userPokemonsId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "userPokemonsId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "tradesSentToMeId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "requestedTradesId" integer`);
        await queryRunner.query(`ALTER TABLE "pokemons" ADD CONSTRAINT "FK_25bf83a7b020c34a1a6f72e29a0" FOREIGN KEY ("userPokemonsId") REFERENCES "users_pokemons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_8bf4d85eca02d159adf9c170c1a" FOREIGN KEY ("userPokemonsId") REFERENCES "users_pokemons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_58b883f6f5683c8baf1677cc9ba" FOREIGN KEY ("tradesSentToMeId") REFERENCES "trades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_36b4bedc5291b081a716a59bb6e" FOREIGN KEY ("requestedTradesId") REFERENCES "trades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
