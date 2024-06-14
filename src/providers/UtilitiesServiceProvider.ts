import {g} from "../helpers";
import {Notify} from "../notifications";

type Actions = "registerGlobalError" | "enableTooltips" | "enableNotifications"

export class UtilitiesServiceProvider {

    static #actions = {
        registerGlobalError: () => {
            window.onerror = (message, source, lineno, colno, error) => {
                console.log('capturando error desde el paquete')
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