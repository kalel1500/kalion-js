import { Route } from '@kalel1500/kalion-js';
import DefaultController from '../src/shared/infrastructure/DefaultController';

export function defineRoutes(): void {
    Route.page('home', [DefaultController, 'home']);
}
