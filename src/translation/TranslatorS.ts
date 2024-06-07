/*
import es from './lang/es.json';
import en from './lang/en.json';
import {__const} from "../helpers";

type TranslationS = Record<string, string>
type TranslationsS = Record<string, TranslationS>

export class TranslatorS
{
    static translations: TranslationsS = {};

    static registerTranslations(lang: string, newTranslations: TranslationS): void {
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }
        Object.assign(this.translations[lang], newTranslations);
    }

    static get(key: string, params?: Record<string, string>): string {
        const currentTranslations = this.translations[__const('lang')] || {};
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
    return TranslatorS.get(key, params)
}
*/
