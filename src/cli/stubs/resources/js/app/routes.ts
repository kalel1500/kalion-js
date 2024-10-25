import { Route } from 'laravel-ts-utilities';
import HomeController from '../src/home/infrastructure/HomeController';
import TestController from '../src/shared/infrastructure/TestController';

export function defineRoutes(): void {
    Route.page('shared.testJs', [TestController, 'testJs']);
    Route.page('home.example1', [HomeController, 'example1']);
}
