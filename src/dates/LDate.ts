import {DateTime} from "luxon";
import {DateTimeUnit} from "luxon/src/datetime";
import {DurationObjectUnits} from "luxon/src/duration";

type ReceivedDate = string | DateTime
type ReceivedNullableDate = string | DateTime | null | undefined

export class LDate {
    // Consultar formatos en: https://moment.github.io/luxon/#/formatting
    static formats = {
        date_startYear: "yyyy-LL-dd",
        date_startDay: "dd-LL-yyyy",
        date_startYear_slash: "yyyy/LL/dd",
        date_startDay_slash: "dd/LL/yyyy",
        date_startMonthWithoutDay_slash: "LL/yyyy",

        datetime_startYear: "yyyy-LL-dd HH:mm:ss",
        datetime_startYear_oneWord: "yyyyLLdd_HHmmss",

        time: "HH:mm:ss",
        timeWithoutHours: "mm:ss",

        timestamp_seconds: "X",
    };

    static #isDatetime(date: any) {
        return (date instanceof DateTime);
    }

    static now() {
        return DateTime.now();
    }

    static local() {
        return DateTime.local();
    }

    static parse(date: string) {
        return DateTime.fromSQL(date);
    }

    static format(date: ReceivedDate, format: string) {
        const datetime = (date instanceof DateTime) ? date : LDate.parse(date);
        return datetime.toFormat(format);
    }

    static toSeconds(date: ReceivedDate) {
        return LDate.format(date, LDate.formats.timestamp_seconds);
    }

    static hasSame(d1: ReceivedNullableDate, d2: ReceivedNullableDate, unit: DateTimeUnit) {
        if (d1 === null || d2 === null || d1 === undefined || d2 === undefined) return false;
        d1 = (d1 instanceof DateTime) ? d1 : LDate.parse(d1);
        d2 = (d2 instanceof DateTime) ? d2 : LDate.parse(d2);
        return d1.hasSame(d2, unit);
    }

    static diffNow(date: ReceivedNullableDate, unit: keyof DurationObjectUnits = "seconds") {
        if (date === null || date === undefined) return null;
        const d = (date instanceof DateTime) ? date : LDate.parse(date);
        return (d.isValid) ? d.diffNow(unit).toObject()[unit] : 0;
    }

    static diff(d1: ReceivedNullableDate, d2: ReceivedNullableDate, unit: keyof DurationObjectUnits = "seconds") {
        if (d1 === null || d2 === null || d1 === undefined || d2 === undefined) return null;
        const date1 = (d1 instanceof DateTime) ? d1 : LDate.parse(d1);
        const date2 = (d2 instanceof DateTime) ? d2 : LDate.parse(d2);
        return date1.diff(date2, unit).toObject()[unit];
    }

    static getTimeId() {
        return LDate.format(LDate.now(), LDate.formats.datetime_startYear_oneWord);
    }
}
