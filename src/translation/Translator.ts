import es from './lang/es.json';
import en from './lang/en.json';
import {_const} from "../helpers/Constants";

type Translation = Record<string, string>
type Translations = Record<string, Translation>

export default class Translator
{
    static translations: Translations = {};

    static registerTranslations(lang: string, newTranslations: Translation): void {
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }
        Object.assign(this.translations[lang], newTranslations);
    }

    static get(key: string, params?: Record<string, string>): string {
        const currentTranslations = this.translations[_const.lang] || {};
        const translation = currentTranslations[key] || key;
        if (!params) return translation;

        return Object.keys(params).reduce((str, param) => {
            return str.replace(`:${param}`, params[param]);
        }, translation);
    }

    static registerDefaultTranslations()
    {
        this.registerTranslations('es', es);
        this.registerTranslations('en', en);
    }
}

export function __(key: string, params?: Record<string, string>): string {
    return Translator.get(key, params)
}
