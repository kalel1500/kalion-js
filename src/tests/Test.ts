import {__const} from "../helpers";
import {___} from "../translation";


export class Test
{
    public static printConstant()
    {
        console.log(__const('lang'));
    }

    public static printTranslation()
    {
        console.log(___('contact_pi_team'))
    }
}