import { UserPokemons } from './../entity/UsersPokemons';
import { TradeStaus } from '../entity/Trade';

export interface TradesResponse {
    tradeId: number;
    tradeStatus: TradeStaus;
    pokemonsRequested: UserPokemons[];
    pokemonsSent: UserPokemons[];
    sentByMe: boolean;
    userNameSentTo: string;
    userNameSentBy: string;
}
