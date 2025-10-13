import es from './lang/es.json';
import en from './lang/en.json';
import { DefaultTranslations, Translation, TranslationReplacements } from '@/app';
import { __const } from '@/app/core/infrastructure/utilities/_internal/helpers';

interface Translations<T extends Translation> {
    [key: string]: T;
}

export class Translator<T extends DefaultTranslations> {
    private static instance: Translator<any>;
    private locale: string = __const('lang');
    private translations: Translations<DefaultTranslations> = {en, es};
    private externalTranslations: Translations<T> = {};

    public static getInstance<U extends DefaultTranslations>(): Translator<U> {
        if (!Translator.instance) {
            Translator.instance = new Translator<U>();
        }
        return Translator.instance;
    }

    public registerTranslations(locale: string, translations: Partial<T>): void {
        if (!this.externalTranslations[locale]) {
            this.externalTranslations[locale] = {} as T;
        }
        this.externalTranslations[locale] = {
            ...this.externalTranslations[locale],
            ...translations,
        };
    }

    public get<K extends keyof T>(key: K, replacements?: TranslationReplacements): string {
        const internalTranslation = this.translations[this.locale]?.[key as keyof DefaultTranslations];
        const externalTranslation = this.externalTranslations[this.locale]?.[key];
        let translation = externalTranslation || internalTranslation || (key as string);

        if (replacements) {
            for (const [placeholder, value] of Object.entries(replacements)) {
                if (value) {
                    // Escapar correctamente el símbolo ":" en el placeholder
                    const regex = new RegExp(`(^|[^\\^]):${placeholder}`, 'g');
                    translation = translation.replace(regex, `$1${value}`);
                }
            }
        }

        // Reemplazar el símbolo de escape (^:) con el símbolo ":"
        translation = translation.replace(/\^:/g, ':');

        return translation;
    }

}
