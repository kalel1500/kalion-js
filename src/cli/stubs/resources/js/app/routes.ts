import { Route } from '@kalel1500/laravel-ts-utils';
import DefaultController from '../src/shared/infrastructure/DefaultController';

export function defineRoutes(): void {
    Route.page('home', [DefaultController, 'home']);
}
