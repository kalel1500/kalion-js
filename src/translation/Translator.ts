import es from './lang/es.json';
import en from './lang/en.json';
import {_const} from "../helpers/Constants";
import {DefaultTranslations} from "../_types";

export interface Translation {
    [key: string]: string;
}

interface Translations<T extends Translation> {
    [key: string]: T;
}


export default class Translator<T extends DefaultTranslations>
{
    private static instance: Translator<DefaultTranslations>;
    private locale: string = _const.lang;
    private translations: Translations<DefaultTranslations> = {en, es};
    private externalTranslations: Translations<T> = {};

    public static getInstance(): Translator<DefaultTranslations>
    {
        if (!Translator.instance) {
            Translator.instance = new Translator<DefaultTranslations>();
        }
        return Translator.instance;
    }

    public registerTranslations(locale: string, translations: Partial<T>): void {
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

const internalTranslator = Translator.getInstance();
export const ___ = (key: keyof DefaultTranslations, replacements?: Record<string, string>) => {
    return internalTranslator.get(key, replacements)
}

/*let INTERNAL: Translator<DefaultTranslations> | null = null;
export function ___(key: keyof DefaultTranslations, replacements?: Record<string, string>): string
{
    if (!INTERNAL) {
        INTERNAL = new TranslatorT<DefaultTranslations>();
    }
    return INTERNAL.get(key, replacements);
}*/
