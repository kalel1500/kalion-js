import { __const } from '@/app/_internal/helpers';

export class TestConstants {
    private property_value: string = __const('VITE_APP_NAME');

    private static static_property_value: string = __const('VITE_APP_NAME');

    private static function_property_value = () => __const('VITE_APP_NAME');

    public printPropertyValue()
    {
        console.log(this.property_value);
    }

    public printMethodValue()
    {
        console.log(__const('VITE_APP_NAME'));
    }

    public static printStaticPropertyValue()
    {
        console.log(TestConstants.static_property_value);
    }

    public static printFunctionPropertyValue()
    {
        console.log(TestConstants.function_property_value());
    }
}