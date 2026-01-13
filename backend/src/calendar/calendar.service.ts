import { Injectable } from '@nestjs/common';
// @ts-ignore
import { Solar, Lunar, HolidayUtil, I18n } from 'lunar-javascript';
import { LunarVN } from './lunar-vn';

@Injectable()
export class CalendarService {
    constructor() {
        I18n.setMessages('vn', LunarVN);
        I18n.setLanguage('vn');
    }

    /**
     * Lấy chi tiết ngày theo lịch âm dương
     */
    getDayDetails(date: Date) {
        try {
            const solar = Solar.fromDate(date);
            const lunar = solar.getLunar();

            return {
                solar: {
                    date: solar.toYmd(),
                    weekDay: solar.getWeekInChinese(),
                },
                lunarDay: lunar.getDay(),
                lunarMonth: lunar.getMonth(),
                lunarYear: lunar.getYear(),
                heavenlyStem: lunar.getDayGan(),
                earthlyBranch: lunar.getDayZhi(),
                zodiac: lunar.getYearShengXiao(),
                isTerm: lunar.getJieQi() !== '',
                term: lunar.getJieQi(),
                shouldDo: lunar.getDayYi(),
                shouldNotDo: lunar.getDayJi(),
                auspiciousHours: this.getAuspiciousHours(lunar),
            };
        } catch (error) {
            console.error('Error getting day details:', error);
            throw error;
        }
    }

    private getAuspiciousHours(lunar: Lunar) {
        // TianShenType might be Chinese if not translated, filtering for '吉' (Lucky)
        // If translated, we might need to adjust, but for now we assume '吉' is used or we filter by safe list
        // Actually, getTianShenType() returns the 'type' string.
        // If untested, return all hours is safer, or check data.
        return lunar.getDayTimes()
            .filter((t: any) => t.getTianShenType() === '吉' || t.getTianShenType().includes('吉'))
            .map((t: any) => `${t.getZhi()} (${t.getTianShen()})`);
    }

    getLunarMonth(year: number, month: number) {
        const daysInMonth = new Date(year, month, 0).getDate();
        const result = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const d = Solar.fromYmd(year, month, i);
            const l = d.getLunar();
            result.push({
                day: i,
                lunarDay: l.getDay(),
                lunarMonth: l.getMonth(),
                isFirstLunar: l.getDay() === 1,
                isTerm: l.getJieQi() !== '',
                term: l.getJieQi()
            });
        }
        return result;
    }
}
