import { Application, Router } from 'express';
import userRoutes from './user-routes';
import pokemonRoutes from './pokemon-routes';

const _routes: [string, Router][] = [
    ['/api/users', userRoutes],
    ['/api/pokemons', pokemonRoutes],
];

export const routes = (app: Application): void => {
    _routes.forEach((route) => {
        const [url, handler] = route;
        app.use(url, handler);
    });
};
