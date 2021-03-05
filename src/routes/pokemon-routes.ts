import { check } from 'express-validator';
import { Router } from 'express';
import {
    addPokemonToUserPokedex,
    fetchPokemonsByPage,
    fetchLoggedUserPokemons,
    removePokemonFromUserPokedex,
    buildRequestedTrade,
    fetchPokemonsForGivenUser,
} from '../controllers/pokemon-controller';
import { isUserAuthenticated } from '../util/auth-util';
import { enforceValidInputs } from '../util/input-validation-util';

const router = Router();

router.get('/my_pokemons', isUserAuthenticated, fetchLoggedUserPokemons);

router.get('/user/:userId', isUserAuthenticated, fetchPokemonsForGivenUser);

router.get('/:page', isUserAuthenticated, fetchPokemonsByPage);

router.post(
    '/add_pokemon_to_pokedex',
    isUserAuthenticated,
    [check('pokemonId').isNumeric()],
    enforceValidInputs,
    addPokemonToUserPokedex,
);

router.post(
    '/remove_pokemon_from_pokedex',
    isUserAuthenticated,
    [check('userPokemonId').isNumeric()],
    enforceValidInputs,
    removePokemonFromUserPokedex,
);

router.post(
    '/trade',
    isUserAuthenticated,
    [
        check('requestedUserId').isNumeric(),
        check('requestedPokemons').notEmpty().isArray(),
        check('givenPokemons').notEmpty().isArray(),
    ],
    enforceValidInputs,
    buildRequestedTrade,
);

export default router;
