import {__const} from "../_internal/helpers";
import {___} from "../_internal/helpers";


export class Test
{
    public static printConstant()
    {
        console.log(__const('lang'));
        console.log(__const('VITE_BROADCASTING_ENABLED'));
    }

    public static printTranslation()
    {
        console.log(___('contact_pi_team'))
    }
}