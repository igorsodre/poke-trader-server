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

export const getDefaultPokemon = (): Pokemon => {
    const pokemon: Pokemon = new Pokemon();
    pokemon.name = 'pokemonDefult1';
    pokemon.species = 'speciesDefult1';
    pokemon.weight = 152;
    pokemon.height = 50;
    pokemon.baseExperience = 50;
    pokemon.pokeApiId = 500;
    return pokemon;
};
