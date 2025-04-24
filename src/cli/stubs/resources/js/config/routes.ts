import { Route } from '@kalel1500/kalion-js';
import HomeController from '../src/home/infrastructure/HomeController';

export function defineRoutes(): void {
    Route.page('home', [HomeController, 'home']);
}
