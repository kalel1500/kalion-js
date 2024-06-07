import {DefaultConstants, DefaultTranslations} from "../_types";
import {Translator} from "../translation";
import {Constants} from "../helpers";

export const __const = <T extends keyof DefaultConstants>(key: T): DefaultConstants[T] => {
    return Constants.getInstance().get(key);
}

export const ___ = (key: keyof DefaultTranslations, replacements?: Record<string, string>) => {
    return Translator.getInstance().get(key, replacements)
}
