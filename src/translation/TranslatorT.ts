import es from './lang/es.json';
import en from './lang/en.json';
import {_const} from "../helpers/Constants";
import {DefaultTranslations} from "../_types";

export interface TranslationT {
    [key: string]: string;
}

interface TranslationsT<T extends TranslationT> {
    [key: string]: T;
}


export default class TranslatorT<T extends DefaultTranslations>
{
    private locale: string = _const.lang;
    private translations: TranslationsT<DefaultTranslations> = {en, es};
    private externalTranslations: TranslationsT<T> = {};

    public addTranslations(locale: string, translations: Partial<T>): void {
        if (!this.externalTranslations[locale]) {
            this.externalTranslations[locale] = {} as T;
        }
        this.externalTranslations[locale] = {
            ...this.externalTranslations[locale],
            ...translations
        };
    }

    public get<K extends keyof T>(key: K, replacements?: Record<string, string>): string {
        const internalTranslation = this.translations[this.locale]?.[key as keyof DefaultTranslations];
        const externalTranslation = this.externalTranslations[this.locale]?.[key];
        let translation = externalTranslation || internalTranslation || (key as string);

        if (replacements) {
            for (const [placeholder, value] of Object.entries(replacements)) {
                const regex = new RegExp(`:${placeholder}`, 'g');
                translation = translation.replace(regex, value);
            }
        }

        return translation;
    }

}


let INTERNAL: TranslatorT<DefaultTranslations> | null = null;
export function ___(key: keyof DefaultTranslations, replacements?: Record<string, string>): string
{
    if (!INTERNAL) {
        INTERNAL = new TranslatorT<DefaultTranslations>();
    }
    return INTERNAL.get(key, replacements);
}
