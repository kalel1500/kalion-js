import { __const } from '../_internal/helpers';

export class TestConstants {
    private property_value: string = __const('VITE_APP_NAME');
    private constructor_value: string;

    constructor() {
        this.constructor_value = __const('VITE_APP_NAME');
    }

    printPropertyValue()
    {
        console.log(this.property_value);
    }

    printConstructorValue()
    {
        console.log(this.constructor_value);
    }

    printMethodValue()
    {
        console.log(__const('VITE_APP_NAME'));
    }

}