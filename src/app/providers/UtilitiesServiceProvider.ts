import { g, LStorage, Notify } from '../core/infrastructure';
import { LayoutListenersUseCase } from '../core/application';
import { StorageProcessKeys } from '../core/_types';

type Features = keyof typeof UtilitiesServiceProvider.actions;

export class UtilitiesServiceProvider {

    static actions = {
        startStorageDay: () => {
            if (LStorage.isFirstConnectionInDay()) {
                LStorage.setNowAsLastConnection();
                LStorage.removeItem(StorageProcessKeys.reverb);
                LStorage.removeItem(StorageProcessKeys.queue);
            }

            /*// let test = MyLuxon.stringToLxDate(MyStorage.getItem("lastConnection"));
            // console.log("lastConnection");
            // console.log(test.toFormat(MyLuxon.formats.datetime_startYear));

            // let now = MyLuxon.now();
            // console.log("hoy menos dos dias:");
            // console.log(now.minus({day:2}).toFormat(MyLuxon.formats.date_startDay));
            // console.log(now.minus({day:2}).toFormat(MyLuxon.formats.timestamp_seconds));*/
        },
        enableTooltips: () => {
            g.startTooltips();
        },

        registerGlobalError: () => {
            window.onerror = (message, source, lineno, colno, error) => {
                return g.handleGlobalError(message, source, lineno, colno, error);
            };
        },
        enableNotifications: () => {
            Notify.checkAndRequestPermission();
        },
        startLayoutListeners: () => {
            LayoutListenersUseCase.new().__invoke();
        },
    };

    static features(actions: Features[]) {
        actions.forEach(item => {
            const action = this.actions[item];
            action();
        });
    }
}