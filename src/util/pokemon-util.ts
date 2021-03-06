import { In } from 'typeorm';
import { UserPokemons } from '../entity/UsersPokemons';
import { Trade } from './../entity/Trade';

export interface PokemonsFromTrade {
    requested: UserPokemons[];
    sent: UserPokemons[];
    status: number;
    tradeId: number;
    userNameSentTo: string;
    userNameSentBy: string;
}
export const getPokemonsFromTrade = async (trade: Trade): Promise<PokemonsFromTrade> => {
    let requested: UserPokemons[];
    let sent: UserPokemons[];
    try {
        requested = (await UserPokemons.find({ where: { id: In(trade.requestedPokemons) } })) as UserPokemons[];
        sent = (await UserPokemons.find({
            where: { id: In(trade.pokemonsSentToRequestedUser) },
        })) as UserPokemons[];
    } catch (err) {
        requested = [];
        sent = [];
    }

    return {
        requested,
        sent,
        status: trade.status,
        tradeId: trade.id,
        userNameSentTo: trade.requested.name,
        userNameSentBy: trade.requester.name,
    };
};
