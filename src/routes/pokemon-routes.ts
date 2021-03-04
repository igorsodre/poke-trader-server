import { check } from 'express-validator';
import { Router } from 'express';
import {
    addPokemonToUserPokedex,
    fetchPokemonsByPage,
    fetchUsersPokemons,
    removePokemonFromUserPokedex,
} from '../controllers/pokemon-controller';
import { isUserAuthenticated } from '../util/auth-util';
import { enforceValidInputs } from '../util/input-validation-util';

const router = Router();

router.get('/my_pokemons', isUserAuthenticated, fetchUsersPokemons);

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
    [check('pokemonId').isNumeric()],
    enforceValidInputs,
    removePokemonFromUserPokedex,
);

export default router;
