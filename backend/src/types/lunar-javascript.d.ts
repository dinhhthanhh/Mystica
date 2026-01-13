declare module 'lunar-javascript' {
    export class Solar {
        static fromDate(date: Date): Solar;
        static fromYmdHms(y: number, m: number, d: number, h: number, min: number, s: number): Solar;
        static fromYmd(y: number, m: number, d: number): Solar;
        getLunar(): Lunar;
        toYmd(): string;
        getWeekInChinese(): string;
        getDay(): number;
    }
    export class Lunar {
        getDay(): number;
        getMonth(): number;
        getYear(): number;
        getYearInGanZhi(): string;
        getMonthInGanZhi(): string;
        getDayInGanZhi(): string;
        getDayGan(): string;
        getDayZhi(): string;
        getDayShengXiao(): string;
        getYearShengXiao(): string;
        getYearGan(): string;
        getYearZhi(): string;
        getJieQi(): string;
        getDayYi(): string[];
        getDayJi(): string[];
        getDayTimes(): any[];
        getYearZodiac(): string;
        getYearNaYin(): string;
        getYearInChinese(): string;
        getMonthInChinese(): string;
    }
    export class HolidayUtil { }
    export class Iizuki { }
}
