import { Router } from 'express';
import { check } from 'express-validator';
import { isUserAuthenticated } from '../util/auth-util';
import { enforceValidInputs } from '../util/input-validation-util';
import { buildRequestedTrade, fetchUserTrades, rejectTrade, acceptTrade } from './../controllers/trades-controller';

const router = Router();

router.get('/', isUserAuthenticated, fetchUserTrades);

router.post(
    '/',
    isUserAuthenticated,
    [
        check('requestedUserId').isNumeric(),
        check('requestedPokemons').notEmpty().isArray(),
        check('givenPokemons').notEmpty().isArray(),
    ],
    enforceValidInputs,
    buildRequestedTrade,
);

router.post('/accept', isUserAuthenticated, [check('tradeId').isNumeric()], enforceValidInputs, acceptTrade);

router.post('/reject', isUserAuthenticated, [check('tradeId').isNumeric()], enforceValidInputs, rejectTrade);
export default router;
