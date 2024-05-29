import lang_utils_es from './lang/es.json';
import lang_utils_en from './lang/en.json';
import lang_app_es from '../../app/shared/lang/es.json';
import lang_app_en from '../../app/shared/lang/en.json';
import {_const} from "../../app/config";

class Translator
{
    static #currentLang = _const.lang;
    static #translations: Record<string,Record<string, string>> = {
        es: {...lang_utils_es, ...lang_app_es},
        en: {...lang_utils_en, ...lang_app_en},
    };

    static changeLanguage(lang: string): void
    {
        this.#currentLang = lang
    }

    static get(key: string, literalValues: object = {}): string
    {
        let result = this.#translations[this.#currentLang][key] || key;
        Object.entries(literalValues).forEach(([key, value]) => {
            result = result.replace(new RegExp(key,"g"), value);
        });
        return result;
    }

}

class lang
{
    static contact_pi_team = __('contact_pi_team')
}

function __(key: string, literalValues: object = {})
{
    return Translator.get(key, literalValues)
}


export {lang, __}
