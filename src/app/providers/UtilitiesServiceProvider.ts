import { g, LStorage } from '../core';
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
        startStorageDay: () => {
            if (LStorage.isFirstConnectionInDay()) {
                LStorage.setNowAsLastConnection();
                LStorage.removeItem("websocketsFailed"); // restartWebsocketsStorage
            }

            /*// let test = MyLuxon.stringToLxDate(MyStorage.getItem("lastConnection"));
            // console.log("lastConnection");
            // console.log(test.toFormat(MyLuxon.formats.datetime_startYear));

            // let now = MyLuxon.now();
            // console.log("hoy menos dos dias:");
            // console.log(now.minus({day:2}).toFormat(MyLuxon.formats.date_startDay));
            // console.log(now.minus({day:2}).toFormat(MyLuxon.formats.timestamp_seconds));*/
        },
    };

    static features(actions: Actions[]) {
        actions.forEach(item => {
            const action = this.#actions[item];
            action();
        });
    }
}