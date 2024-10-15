import { LDate } from './LDate';
import { __const } from '../_internal/helpers';

export class LStorage {

    static readonly VERSION = __const('VITE_APP_STORAGE_VERSION'); // Cambia este valor para invalidar el localStorage
    static readonly VERSION_KEY = 'config-version';

    static setItem(key: string, value: string) {
        window.localStorage.setItem(key, value);
    }

    static getItem(key: string) {
        return window.localStorage.getItem(key);
    }

    static removeItem(key: string) {
        window.localStorage.removeItem(key);
    }

    static exist(key: string) {
        return LStorage.getItem(key) !== null;
    }

    static checkAndUpdateVersion() {
        const savedVersion = localStorage.getItem(LStorage.VERSION_KEY);
        if (savedVersion !== LStorage.VERSION) {
            localStorage.clear();
            localStorage.setItem(LStorage.VERSION_KEY, LStorage.VERSION);
        }
    }


    static isFirstConnectionInDay() {
        const validSecondsToBeCountedAsTheSameDay = 10;
        const lastConn = LStorage.getItem('lastConnection');
        const diffNow = LDate.diffNow(lastConn, 'seconds');
        return (
            !LStorage.exist('lastConnection')
            ||
            !LDate.hasSame(LDate.now(), lastConn, 'day')
            ||
            (Math.abs(diffNow ?? 0) < validSecondsToBeCountedAsTheSameDay)
        );
    }

    static setNowAsLastConnection() {
        LStorage.setItem('lastConnection', LDate.toSeconds(LDate.now()));
    }

}
