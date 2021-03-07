import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Like } from 'typeorm';
import { Pokemon } from '../entity/Pokemon';
import { User } from '../entity/User';
import { UserPokemons } from './../entity/UsersPokemons';
import { ServerErrorResponse } from './../util/default-error-response';

const PAGE_COUNT = 10;
export const fetchPokemonsByPage: RequestHandler = async (req, res, next) => {
    let page = Number(req.params.page);
    if (!page || isNaN(page)) page = 0;
    let result: Pokemon[];
    let count = 0;
    try {
        result = await Pokemon.find({ order: { name: 'ASC' }, skip: PAGE_COUNT * page, take: PAGE_COUNT });
        count = await Pokemon.count();
    } catch (err) {
        return next(
            new ServerErrorResponse('Failed to get pokemons for given page', StatusCodes.INTERNAL_SERVER_ERROR, err),
        );
    }
    res.json({ data: result, totalCount: count });
};

export const searchPokemonsByname: RequestHandler = async (req, res, next) => {
    const { pokeName } = req.query;
    let result: Pokemon[];

    try {
        result = await Pokemon.find({ where: { name: Like(`%${pokeName}%`) }, order: { name: 'ASC' }, take: 5 });
    } catch (err) {
        return next(new ServerErrorResponse('Failed search pokemon', StatusCodes.INTERNAL_SERVER_ERROR, err));
    }
    res.json({ data: result });
};

// TODO: think of a way to refactor this next 2 routes. The error handling makes it kind of hard
export const fetchPokemonsForGivenUser: RequestHandler = async (req, res, next) => {
    const { userId } = req.params as IAccessTokenFormat;
    let user: User;

    try {
        user = (await User.findOne(userId, { relations: ['userPokemons'] })) as User;
    } catch (err) {
        return next(new ServerErrorResponse('Error retrieving pokemon/user', StatusCodes.INTERNAL_SERVER_ERROR, err));
    }
    if (!user?.userPokemons) {
        return next(new ServerErrorResponse('Could not find pokemon/user', StatusCodes.NOT_FOUND));
    }
    return res.json({ data: user.userPokemons });
};

export const fetchLoggedUserPokemons: RequestHandler = async (req, res, next) => {
    const { userId } = req.appData as IAccessTokenFormat;
    let user: User;
    try {
        user = (await User.findOne(userId, { relations: ['userPokemons'] })) as User;
    } catch (err) {
        return next(new ServerErrorResponse('Error retrieving pokemon/user', StatusCodes.INTERNAL_SERVER_ERROR, err));
    }
    if (!user?.userPokemons) {
        return next(new ServerErrorResponse('Could not find pokemon/user', StatusCodes.NOT_FOUND));
    }
    res.json({ data: user.userPokemons });
};

export const addPokemonToUserPokedex: RequestHandler = async (req, res, next) => {
    const { pokemonId } = req.body;
    const { userId } = req.appData as IAccessTokenFormat;
    let pokemon: Nullable<Pokemon>;
    let user: Nullable<User>;
    try {
        pokemon = await Pokemon.findOne(pokemonId);
        user = await User.findOne(userId);
    } catch (err) {
        return next(new ServerErrorResponse('Error retrieving pokemon/user', StatusCodes.INTERNAL_SERVER_ERROR, err));
    }
    if (!pokemon || !user) {
        return next(new ServerErrorResponse('Could not find pokemon/user', StatusCodes.NOT_FOUND));
    }
    const userPokemon: UserPokemons = new UserPokemons();
    try {
        userPokemon.user = user;
        userPokemon.pokemon = pokemon;
        await userPokemon.save();
    } catch (err) {
        return next(new ServerErrorResponse('Filed to add pokemon to pokedex', StatusCodes.INTERNAL_SERVER_ERROR));
    }

    res.json({ data: userPokemon });
};

export const removePokemonFromUserPokedex: RequestHandler = async (req, res, next) => {
    const { userPokemonId } = req.body;

    let userPokemon: UserPokemons;
    try {
        userPokemon = (await UserPokemons.findOne(userPokemonId)) as UserPokemons;
    } catch (err) {
        return next(new ServerErrorResponse('Error retrieving pokemon/user', StatusCodes.INTERNAL_SERVER_ERROR, err));
    }
    if (!userPokemon) {
        return next(new ServerErrorResponse('Could not find pokemon/user', StatusCodes.NOT_FOUND));
    }
    try {
        await userPokemon.remove();
    } catch (err) {
        return next(new ServerErrorResponse('Filed to remove pokemon from pokedex', StatusCodes.INTERNAL_SERVER_ERROR));
    }

    res.json({ data: 'OK' });
};
