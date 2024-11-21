import { Instantiable } from "laravel-ts-utilities";

export default class HomeUseCase extends Instantiable
{
    __invoke() {
        console.log('inicio');
    }
}
