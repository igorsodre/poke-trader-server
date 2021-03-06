import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getManager, In } from 'typeorm';
import { Trade, TradeStaus } from '../entity/Trade';
import { User } from '../entity/User';
import { UserPokemons } from '../entity/UsersPokemons';
import { ServerErrorResponse } from '../util/default-error-response';
import { getPokemonsFromTrade } from '../util/pokemon-util';
import { TradesResponse } from './../typings/trades-interfaces';
import { PokemonsFromTrade } from './../util/pokemon-util';

export const fetchUserTrades: RequestHandler = async (req, res, next) => {
    const { userId } = req.appData as IAccessTokenFormat;

    // validade if both users exist
    let user: User;
    try {
        user = (await User.findOne(userId, { relations: ['requestedTrades', 'tradesSentToMe'] })) as User;
    } catch (err) {
        return next(new ServerErrorResponse('Failed to retrieve users', StatusCodes.INTERNAL_SERVER_ERROR, err));
    }
    if (!user) {
        return next(new ServerErrorResponse('Could not find users', StatusCodes.NOT_FOUND));
    }

    const tradesResponse: TradesResponse[] = [];
    try {
        // Get pokemons details for all trades
        const promiseArrTradesSet: Promise<PokemonsFromTrade>[] = [];
        const promiseArrTradesGotten: Promise<PokemonsFromTrade>[] = [];
        user.requestedTrades.forEach((t) => {
            promiseArrTradesSet.push(getPokemonsFromTrade(t));
        });
        user.tradesSentToMe.forEach((t) => {
            promiseArrTradesGotten.push(getPokemonsFromTrade(t));
        });
        const tradesSent = await Promise.all(promiseArrTradesSet);
        const tradesGotten = await Promise.all(promiseArrTradesGotten);

        // separate between trades made and trades taken
        tradesSent.forEach((t) => {
            tradesResponse.push({
                pokemonsRequested: t.requested,
                pokemonsSent: t.sent,
                sentByMe: true,
                tradeId: t.tradeId,
                tradeStatus: t.status,
                userNameSentBy: t.userNameSentBy,
                userNameSentTo: t.userNameSentTo,
            });
        });
        tradesGotten.forEach((t) => {
            tradesResponse.push({
                pokemonsRequested: t.requested,
                pokemonsSent: t.sent,
                sentByMe: false,
                tradeId: t.tradeId,
                tradeStatus: t.status,
                userNameSentBy: t.userNameSentBy,
                userNameSentTo: t.userNameSentTo,
            });
        });
    } catch (err) {
        return next(new ServerErrorResponse('Failed to fetch pokemons from trades', StatusCodes.INTERNAL_SERVER_ERROR));
    }
    res.json({ data: tradesResponse });
};

interface BuildRequestedTradeBody {
    requestedUserId: number;
    requestedPokemons: number[];
    givenPokemons: number[];
}
export const buildRequestedTrade: RequestHandler = async (req, res, next) => {
    const { userId } = req.appData as IAccessTokenFormat;
    const { requestedUserId, requestedPokemons, givenPokemons } = req.body as BuildRequestedTradeBody;

    // validade if both users exist
    let user: User;
    let requestedUser: User;
    try {
        user = (await User.findOne(userId)) as User;
        requestedUser = (await User.findOne(requestedUserId)) as User;
    } catch (err) {
        return next(new ServerErrorResponse('Failed to retrieve users', StatusCodes.INTERNAL_SERVER_ERROR, err));
    }
    if (!user || !requestedUser) {
        return next(new ServerErrorResponse('Could not find users', StatusCodes.NOT_FOUND));
    }

    // TODO: validade if all pokemons requested and provided exist
    try {
        const trade = new Trade();
        trade.requester = user;
        trade.requested = requestedUser;
        trade.pokemonsSentToRequestedUser = givenPokemons;
        trade.requestedPokemons = requestedPokemons;
        trade.status = TradeStaus.Active;
        await trade.save();
    } catch (err) {
        return next(new ServerErrorResponse('Failed to create trade request', StatusCodes.NOT_FOUND));
    }

    res.json({ data: 'ok' });
};

export const rejectTrade: RequestHandler = async (req, res, next) => {
    const { tradeId } = req.body;
    const { userId } = req.appData as IAccessTokenFormat;
    let trade: Trade;
    try {
        trade = (await Trade.findOne(tradeId)) as Trade;
    } catch (err) {
        return next(new ServerErrorResponse('Failed to find trade', StatusCodes.NOT_FOUND, err));
    }
    if (!trade || trade.requested.id !== Number(userId)) {
        return next(new ServerErrorResponse("You can't modify this trade", StatusCodes.FORBIDDEN));
    }

    try {
        trade.status = TradeStaus.FinishedFailed;
        trade.save();
    } catch (err) {
        return next(new ServerErrorResponse('Failed to reject trade', StatusCodes.NOT_FOUND, err));
    }

    res.json({ data: 'ok' });
};

export const acceptTrade: RequestHandler = async (req, res, next) => {
    const { tradeId } = req.body;
    const { userId } = req.appData as IAccessTokenFormat;
    let trade: Trade;
    try {
        trade = (await Trade.findOne(tradeId)) as Trade;
    } catch (err) {
        return next(new ServerErrorResponse('Failed to find trade', StatusCodes.NOT_FOUND, err));
    }
    if (!trade || trade.requested.id !== Number(userId)) {
        return next(new ServerErrorResponse("You can't modify this trade", StatusCodes.FORBIDDEN));
    }

    try {
        await getManager().transaction(async (transactionalEntityManager) => {
            // find all requested and sent pokemons
            const requestedPokemons = await transactionalEntityManager
                .getRepository(UserPokemons)
                .find({ where: { id: In(trade.requestedPokemons) } });

            const givenPokemons = await transactionalEntityManager
                .getRepository(UserPokemons)
                .find({ where: { id: In(trade.pokemonsSentToRequestedUser) } });

            requestedPokemons.forEach((r) => {
                r.user = trade.requester;
            });
            givenPokemons.forEach((r) => {
                r.user = trade.requested;
            });

            trade.status = TradeStaus.FinishedSuccess;
            await transactionalEntityManager.save(requestedPokemons);
            await transactionalEntityManager.save(givenPokemons);
            await transactionalEntityManager.save(trade);
        });
    } catch (err) {
        return next(new ServerErrorResponse('Failed to accept trade', StatusCodes.NOT_FOUND, err));
    }

    res.json({ data: 'ok' });
};
