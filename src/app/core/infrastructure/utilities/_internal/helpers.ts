import {DefaultConstants, DefaultTranslations, TranslationReplacements} from "../../../_types";
import {Translator} from "../translation";
import { Constants } from '../general';

export const __const = <T extends keyof DefaultConstants>(key: T): DefaultConstants[T] => {
    return Constants.getInstance().get(key);
};

export const ___ = (key: keyof DefaultTranslations, replacements?: TranslationReplacements) => {
    return Translator.getInstance().get(key, replacements);
};
