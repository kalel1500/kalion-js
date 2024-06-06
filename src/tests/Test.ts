import {__const} from "../helpers/Constants";
import {___} from "../translation/Translator";


export default class Test
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