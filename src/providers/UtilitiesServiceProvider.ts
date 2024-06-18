import {g} from "../core";
import {Notify} from "../core";

type Actions = "registerGlobalError" | "enableTooltips" | "enableNotifications"

export class UtilitiesServiceProvider {

    static #actions = {
        registerGlobalError: () => {
            window.onerror = (message, source, lineno, colno, error) => {
                return g.handleGlobalError(error);
            };
        },
        enableTooltips: () => {
            g.startTooltips();
        },
        enableNotifications: () => {
            Notify.checkAndRequestPermission();
        },
    }

    static features(actions: Actions[]) {
        actions.forEach(item => {
            const action = this.#actions[item];
            action();
        });
    }
}