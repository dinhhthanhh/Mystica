declare module 'lunar-javascript' {
    export class Solar {
        static fromDate(date: Date): Solar;
        static fromYmdHms(y: number, m: number, d: number, h: number, min: number, s: number): Solar;
        static fromYmd(y: number, m: number, d: number): Solar;
        getLunar(): Lunar;
        toYmd(): string;
        getWeekInChinese(): string;
        getWeek(): number;
        getDay(): number;
        getMonth(): number;
        getYear(): number;
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
        getTimes(): any[];
        getYearZodiac(): string;
        getYearNaYin(): string;
        getMonthNaYin(): string;
        getDayNaYin(): string;
        getYearInChinese(): string;
        getMonthInChinese(): string;
        getDayInChinese(): string;
        getZhiXing(): string;
        getXiu(): string;
        getLiuYao(): string;
        getPengZuGan(): string;
        getPengZuZhi(): string;
        getDayPositionXi(): string;
        getDayPositionXiDesc(): string;
        getDayPositionFu(): string;
        getDayPositionFuDesc(): string;
        getDayPositionCai(): string;
        getDayPositionCaiDesc(): string;
        getDayJiShen(): string[];
        getDayXiongSha(): string[];
        getDayTianShen(): string;
        getDayTianShenType(): string;
        getChongDesc(): string;
        getWuHou(): string;
        getYueXiang(): string;
    }
    export class HolidayUtil { }
    export class I18n {
        static setMessages(lang: string, messages: any): void;
        static setLanguage(lang: string): void;
        static getMessage(key: string): string;
    }
}
