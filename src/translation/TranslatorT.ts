import es from './lang/es.json';
import en from './lang/en.json';
import {_const} from "../helpers/Constants";

interface TranslationT {
    [key: string]: string;
}

interface TranslationsT<T extends TranslationT> {
    [key: string]: T;
}

export interface DefaultTranslations extends TranslationT {
    "Ok": string,
    "Unforeseen error": string,
    "Reload Page": string,
    "Loading...": string,
    "Loading": string,
    "Search": string,
    "Filter": string,
    "Date": string,
    "No results": string,
    "Download completed": string,
    "Fetch error message:": string,
    "Some class does not meet the _INTERFACE_ interface contract": string,
    "It has been called a JS component that does not match the current page": string,
    "Need _NUMBER_ characters": string,
    "A loader was expected on the page": string,
    "Check if the loader was in a div.": string,
    "You do not have permissions to edit": string,
    "contact_pi_team": string,
}



export default class TranslatorT<T extends DefaultTranslations>
{
    private locale: string = _const.lang;
    private translations: TranslationsT<DefaultTranslations> = {en, es};
    private externalTranslations: TranslationsT<T> = {};

    public addTranslations(locale: string, translations: Partial<T>): void {
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
