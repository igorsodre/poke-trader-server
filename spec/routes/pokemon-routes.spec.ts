import { getDefaultUser, getNPokemons } from './../mock-helper';
import { mockIsUserAuthenticated } from '../mock-helper';

import 'jest-extended';
import request from 'supertest';
import { Connection, createConnection, getConnection } from 'typeorm';
import { getApp } from '../../src/app';
import { Pokemon } from './../../src/entity/Pokemon';
import { User } from './../../src/entity/User';
import { UserPokemons } from '../../src/entity/UsersPokemons';

jest.mock('../../src/util/auth-util.ts', () => {
    return {
        isUserAuthenticated: mockIsUserAuthenticated,
    };
});
const app = getApp();

// TODO: Write tests for error/fail cases
describe('=> Pokemon routes', () => {
    let con: Connection;
    const user: User = getDefaultUser();
    const pokemon: Pokemon = getNPokemons(1)[0];

    beforeAll(async () => {
        con = await createConnection();
        await getConnection().getRepository(User).insert(user);
    });

    afterEach(async () => {
        // for some reason the 'clear' method is weird with the postgress implementation of typeorm
        await getConnection().getRepository(UserPokemons).delete({});
        await getConnection().getRepository(Pokemon).delete({});
    });

    describe('=> GET /api/pokemons/search', () => {
        test('-> should return searched pokemons', async () => {
            // execute
            await getConnection()
                .getRepository(Pokemon)
                .insert([
                    { id: 1, name: 'p1111', baseExperience: 2, height: 4, weight: 5, species: 'ppp1', pokeApiId: 1 },
                    { id: 2, name: 'p2222', baseExperience: 3, height: 4, weight: 5, species: 'ppp2', pokeApiId: 2 },
                    { id: 3, name: 'p3333', baseExperience: 3, height: 4, weight: 5, species: 'ppp2', pokeApiId: 3 },
                    { id: 4, name: 'p4444', baseExperience: 3, height: 4, weight: 5, species: 'ppp2', pokeApiId: 4 },
                ]);
            const result = await request(app).get('/api/pokemons/search').query({ pokeName: 'p1' });

            // verify
            expect(result.status).toBe(200);
            expect(result.body.data).toBeArrayOfSize(1);
            expect(result.body.data[0].name).toBe('p1111');
        });
    });

    describe('=> GET /api/pokemons/my_pokemons', () => {
        test('-> should return the pokemons from the user', async () => {
            // setup
            await getConnection().getRepository(Pokemon).insert([pokemon]);
            await getConnection().getRepository(UserPokemons).insert([{ user, pokemon }]);

            // execute
            const result = await request(app).get('/api/pokemons/my_pokemons').query({ pokeName: 'p1' });

            // verify
            const data = result.body.data as UserPokemons[];
            expect(result.status).toBe(200);
            expect(data).toBeArrayOfSize(1);
            expect(data[0].pokemon.name).toBe(pokemon.name);
        });
    });

    describe('=> GET /api/pokemons/:page', () => {
        test('-> should return the pokemons for the given page', async () => {
            // setup
            const pokemons = getNPokemons(20);
            await getConnection()
                .getRepository(Pokemon)
                .insert([
                    ...pokemons,
                    {
                        name: 'pokemonDefult21',
                        baseExperience: 3,
                        height: 4,
                        weight: 5,
                        species: 'ppp21',
                        pokeApiId: 4,
                    },
                    {
                        name: 'pokemonDefult22',
                        baseExperience: 3,
                        height: 4,
                        weight: 5,
                        species: 'ppp21',
                        pokeApiId: 4,
                    },
                ]);

            // execute
            const result = await request(app).get('/api/pokemons/2');

            // verify
            const data = result.body.data as Pokemon[];
            expect(result.status).toBe(200);
            expect(data).toBeArrayOfSize(2);
            expect(data[1].name).toBe('pokemonDefult22');
        });
    });

    describe('=> GET /api/pokemons/add_pokemon_to_pokedex', () => {
        test('-> should add a relation between user and pokemon', async () => {
            // setup
            await getConnection().getRepository(Pokemon).insert([pokemon]);

            // execute
            const result = await request(app).post('/api/pokemons/add_pokemon_to_pokedex').send({
                pokemonId: pokemon.id,
            });

            // verify
            const data = result.body.data as UserPokemons;
            expect(result.status).toBe(200);
            expect(data.pokemon.id).toBe(pokemon.id);
        });
    });

    describe('=> GET /api/pokemons/remove_pokemon_from_pokedex', () => {
        test('-> should remove the relation between user and pokemon', async () => {
            // setup
            await getConnection().getRepository(Pokemon).insert([pokemon]);
            const value = await getConnection().getRepository(UserPokemons).insert([{ user, pokemon }]);

            // execute
            const result = await request(app).post('/api/pokemons/remove_pokemon_from_pokedex').send({
                userPokemonId: value.identifiers[0].id,
            });

            // verify
            const count = await UserPokemons.count();

            // verify
            expect(result.status).toBe(200);
            expect(count).toBe(0);
        });
    });

    afterAll(() => {
        con.close();
    });
});
