import { Route } from 'laravel-ts-utilities';
import DefaultController from '../src/shared/infrastructure/DefaultController';

export function defineRoutes(): void {
    Route.page('home', [DefaultController, 'home']);
}
