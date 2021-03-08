// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../src/global.d.ts" />
import { Pokemon } from './../src/entity/Pokemon';
import { RequestHandler } from 'express';
import { User } from '../src/entity/User';

export const mockIsUserAuthenticated: RequestHandler = (req, _res, next) => {
    if (req.method === 'OPTIONS') return next();
    req.appData = { userId: '1' } as IAccessTokenFormat;
    next();
};

export const getDefaultUser = (): User => {
    const user: User = new User();
    user.id = 1;
    user.name = 'u1';
    user.email = 'e1';
    user.password = 'password';
    return user;
};

export const getNPokemons = (numOfPokemons: number): Pokemon[] => {
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
