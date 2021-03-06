import { Application, Router } from 'express';
import userRoutes from './user-routes';
import pokemonRoutes from './pokemon-routes';
import tradeRoutes from './trades-routes';

const _routes: [string, Router][] = [
    ['/api/users', userRoutes],
    ['/api/pokemons', pokemonRoutes],
    ['/api/trades', tradeRoutes],
];

export const routes = (app: Application): void => {
    _routes.forEach((route) => {
        const [url, handler] = route;
        app.use(url, handler);
    });
};
