import { User } from '../entity/User';
import { UserPokemons } from '../entity/UsersPokemons';

export const getAllPokemonsInTradesForGivenUserId = async (userId: number): Promise<UserPokemons[]> => {
    const user = await User.findOne(userId, { relations: ['trades'] });
    let pokemonIds: number[] = [];

    user?.requestedTrades.forEach((t) => {
        pokemonIds = pokemonIds.concat(t.pokemonsSentToRequestedUser);
    });

    return await UserPokemons.findByIds(pokemonIds);
};
