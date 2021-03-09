// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../src/global.d.ts" />
import { Trade, TradeStaus } from './../src/entity/Trade';
import { Pokemon } from './../src/entity/Pokemon';
import { RequestHandler } from 'express';
import { User } from '../src/entity/User';
import { UserPokemons } from '../src/entity/UsersPokemons';

export const mockIsUserAuthenticated: RequestHandler = (req, _res, next) => {
    if (req.method === 'OPTIONS') return next();
    req.appData = { userId: '1' } as IAccessTokenFormat;
    next();
};

export const getNUsers = (numOfUsers = 1): User[] => {
    const usersArray: User[] = [];

    for (let i = 1; i <= numOfUsers; i++) {
        const user: User = new User();
        user.name = 'defaultUser' + i.toString().padStart(2, '0');
        user.email = 'email@email.com + ' + i.toString().padStart(2, '0');
        user.password = 'password' + i.toString().padStart(2, '0');
        usersArray.push(user);
    }
    return usersArray;
};

export const getNPokemons = (numOfPokemons = 1): Pokemon[] => {
    const pokemonArray: Pokemon[] = [];
    for (let i = 1; i <= numOfPokemons; i++) {
        const pokemon: Pokemon = new Pokemon();
        pokemon.name = 'pokemonDefult' + i.toString().padStart(2, '0');
        pokemon.species = 'speciesDefult' + i.toString().padStart(2, '0');
        pokemon.weight = 150 + i;
        pokemon.height = 50 + i;
        pokemon.baseExperience = 50 + i;
        pokemon.pokeApiId = 500 + i;
        pokemonArray.push(pokemon);
    }
    return pokemonArray;
};

export const getUserPokemons = (user: User, pokemons: Pokemon[]): UserPokemons[] => {
    const userPokemonsArray: UserPokemons[] = [];

    pokemons.forEach((p) => {
        const userPokemon = new UserPokemons();
        userPokemon.user = user;
        userPokemon.pokemon = p;
        userPokemonsArray.push(userPokemon);
    });

    return userPokemonsArray;
};

export const getTrade = (
    fromUser: User,
    toUser: User,
    pokemonsTo: UserPokemons[],
    pokemonsFrom: UserPokemons[],
): Trade => {
    const trade = new Trade();

    trade.requester = fromUser;
    trade.requested = toUser;
    trade.status = TradeStaus.Active;
    trade.pokemonsSentToRequestedUser = pokemonsTo.map((p) => p.id);
    trade.requestedPokemons = pokemonsFrom.map((p) => p.id);
    return trade;
};
