import {LDate} from "../dates";

export class LStorage
{
    static setItem(key: string, value: string)
    {
        window.localStorage.setItem(key, value)
    }

    static getItem(key: string)
    {
        return window.localStorage.getItem(key)
    }

    static removeItem(key: string)
    {
        window.localStorage.removeItem(key)
    }

    static exist(key: string)
    {
        return LStorage.getItem(key) !== null
    }



    static isFirstConnectionInDay()
    {
        const validSecondsToBeCountedAsTheSameDay = 10
        const lastConn = LStorage.getItem('lastConnection')
        const diffNow = LDate.diffNow(lastConn, 'seconds')
        return (
            !LStorage.exist('lastConnection')
            ||
            !LDate.hasSame(LDate.now(), lastConn, 'day')
            ||
            (Math.abs(diffNow ?? 0) < validSecondsToBeCountedAsTheSameDay)
        )
    }

    static setNowAsLastConnection()
    {
        LStorage.setItem('lastConnection', LDate.toSeconds(LDate.now()))
    }

    static startStorageDay()
    {
        if (LStorage.isFirstConnectionInDay()) {
            LStorage.setNowAsLastConnection();
            LStorage.removeItem('websocketsFailed') // restartWebsocketsStorage
        }

        /*// let test = MyLuxon.stringToLxDate(MyStorage.getItem('lastConnection'));
        // console.log('lastConnection');
        // console.log(test.toFormat(MyLuxon.formats.datetime_startYear));

        // let now = MyLuxon.now();
        // console.log('hoy menos dos dias:');
        // console.log(now.minus({day:2}).toFormat(MyLuxon.formats.date_startDay));
        // console.log(now.minus({day:2}).toFormat(MyLuxon.formats.timestamp_seconds));*/
    }

}
