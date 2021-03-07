import { searchPokemonsByname } from './../controllers/pokemon-controller';
import { Router } from 'express';
import { check, query } from 'express-validator';
import {
    addPokemonToUserPokedex,
    fetchLoggedUserPokemons,
    fetchPokemonsByPage,
    fetchPokemonsForGivenUser,
    removePokemonFromUserPokedex,
} from '../controllers/pokemon-controller';
import { isUserAuthenticated } from '../util/auth-util';
import { enforceValidInputs } from '../util/input-validation-util';

const router = Router();

router.get(
    '/search',
    isUserAuthenticated,
    [query('pokeName').not().isEmpty()],
    enforceValidInputs,
    searchPokemonsByname,
);

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

export default router;
