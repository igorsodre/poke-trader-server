import {MigrationInterface, QueryRunner} from "typeorm";

export class fixTextFiledsLength1614816247914 implements MigrationInterface {
    name = 'fixTextFiledsLength1614816247914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemons" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "pokemons" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemons" DROP COLUMN "species"`);
        await queryRunner.query(`ALTER TABLE "pokemons" ADD "species" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemons" DROP COLUMN "species"`);
        await queryRunner.query(`ALTER TABLE "pokemons" ADD "species" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemons" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "pokemons" ADD "name" character varying(50) NOT NULL`);
    }

}
