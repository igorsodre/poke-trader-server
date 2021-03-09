import { mockIsUserAuthenticated, getNPokemons, getNUsers, getTrade, getUserPokemons } from './../mock-helper';
import 'jest-extended';
import request from 'supertest';
import { Connection, createConnection, getConnection } from 'typeorm';
import { getApp } from '../../src/app';
import { Trade } from '../../src/entity/Trade';
import { UserPokemons } from '../../src/entity/UsersPokemons';
import { TradesResponse } from '../../src/typings/trades-interfaces';
import { Pokemon } from './../../src/entity/Pokemon';
import { User } from './../../src/entity/User';

jest.mock('../../src/util/auth-util.ts', () => {
    return {
        isUserAuthenticated: mockIsUserAuthenticated,
    };
});
const app = getApp();
describe('=> Trades routes', () => {
    let con: Connection;
    const user: User = getNUsers()[0];
    beforeAll(async () => {
        con = await createConnection();
        await getConnection().getRepository(User).insert(user);
    });

    afterEach(async () => {
        await getConnection().getRepository(Trade).delete({});
        await getConnection().getRepository(UserPokemons).delete({});
        await getConnection().getRepository(Pokemon).delete({});
    });

    afterAll(async () => {
        await getConnection().getRepository(User).delete({});
        await con.close();
    });

    describe('=> GET api/trades/', () => {
        test('-> should return trades for the user', async () => {
            // setup
            const pokemonsForFirstUser = getNPokemons(3);
            const userPokemonsForFirstUser = getUserPokemons(user, pokemonsForFirstUser);

            const secondUser = getNUsers(2)[1];
            const pokemonsForSecondUser = getNPokemons(3);
            const userPokemonsForSecondUser = getUserPokemons(secondUser, pokemonsForSecondUser);

            const trade = getTrade(user, secondUser, userPokemonsForFirstUser, userPokemonsForSecondUser);

            await getConnection().getRepository(User).insert(secondUser);

            await getConnection()
                .getRepository(Pokemon)
                .insert([...pokemonsForFirstUser, ...pokemonsForSecondUser]);

            await getConnection()
                .getRepository(UserPokemons)
                .insert([...userPokemonsForFirstUser, ...userPokemonsForSecondUser]);

            await getConnection().getRepository(Trade).insert(trade);

            // execute
            const result = await request(app).get('/api/trades/');

            // verify
            const data = result.body.data as TradesResponse[];
            expect(result.status).toBe(200);
            expect(data).toBeArrayOfSize(1);
            expect(data[0].tradeId).toBe(trade.id);
            expect(data[0].userNameSentBy).toBe(user.name);
            expect(data[0].userNameSentTo).toBe(secondUser.name);
        });
    });
});
