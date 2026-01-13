import { Injectable } from '@nestjs/common';
// @ts-ignore
import { Solar, Lunar, HolidayUtil, I18n } from 'lunar-javascript';
import { LunarVN } from './lunar-vn';

@Injectable()
export class CalendarService {
    private digitMap: Record<string, string> = {
        '〇': '0', '一': '1', '二': '2', '三': '3', '四': '4',
        '五': '5', '六': '6', '七': '7', '八': '8', '九': '9'
    };

    constructor() {
        I18n.setMessages('vn', LunarVN);
        I18n.setLanguage('vn');
    }

    private translate(text: string): string {
        if (!text) return text;

        // 1. Direct match (fast path)
        if ((LunarVN as any)[text]) return (LunarVN as any)[text];

        // 2. Digit only path
        if (/^[〇一二三四五六七八九]+$/.test(text)) {
            return text.split('').map(char => this.digitMap[char] || char).join('');
        }

        // 3. Multi-replacement for mixed strings (like PengZu or Chong)
        let result = text;
        const keys = Object.keys(LunarVN).sort((a, b) => b.length - a.length);
        for (const key of keys) {
            if (key.length >= 1 && result.includes(key)) {
                const replacement = (LunarVN as any)[key];
                result = result.split(key).join(replacement);
            }
        }

        // Final pass for digits if any remain
        for (const digit in this.digitMap) {
            result = result.split(digit).join(this.digitMap[digit]);
        }

        return result;
    }

    private translateArray(arr: string[]): string[] {
        return arr.map(item => this.translate(item));
    }

    /**
     * Lấy chi tiết ngày theo lịch âm dương (Nâng cao)
     */
    getDayDetails(date: Date) {
        try {
            const solar = Solar.fromDate(date);
            const lunar = solar.getLunar();

            const weekDays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
            const weekDayVn = weekDays[solar.getWeek()];

            return {
                solar: {
                    date: solar.toYmd(),
                    day: solar.getDay(),
                    month: solar.getMonth(),
                    year: solar.getYear(),
                    weekDay: weekDayVn,
                },
                lunar: {
                    day: lunar.getDay(),
                    month: lunar.getMonth(),
                    year: lunar.getYear(),
                    isLeap: lunar.getMonth() < 0,
                    dayInVietnamese: this.translate(lunar.getDayInChinese()),
                    monthInVietnamese: this.translate(lunar.getMonthInChinese()),
                    yearInVietnamese: this.translate(lunar.getYearInChinese()),
                    fullDate: `Ngày ${this.translate(lunar.getDayInChinese())} tháng ${this.translate(lunar.getMonthInChinese())} năm ${lunar.getYearInGanZhi()} (${this.translate(lunar.getYearShengXiao())})`,
                    heavenlyStem: lunar.getDayGan(),
                    earthlyBranch: lunar.getDayZhi(),
                    zodiac: this.translate(lunar.getYearShengXiao()),
                    naYin: this.translate((lunar as any).getDayNaYin()),
                },
                details: {
                    zhiXing: this.translate((lunar as any).getZhiXing()),
                    xiu: this.translate((lunar as any).getXiu()),
                    liuYao: this.translate((lunar as any).getLiuYao()),
                    pengZuGan: this.translate((lunar as any).getPengZuGan()),
                    pengZuZhi: this.translate((lunar as any).getPengZuZhi()),
                    chong: this.translate((lunar as any).getChongDesc()),
                    wuHou: this.translate((lunar as any).getWuHou()),
                    yueXiang: this.translate((lunar as any).getYueXiang()),
                    directions: {
                        xi: this.translate((lunar as any).getDayPositionXiDesc()),
                        fu: this.translate((lunar as any).getDayPositionFuDesc()),
                        cai: this.translate((lunar as any).getDayPositionCaiDesc()),
                    },
                    jiShen: this.translateArray((lunar as any).getDayJiShen()),
                    xiongSha: this.translateArray((lunar as any).getDayXiongSha()),
                },
                isTerm: lunar.getJieQi() !== '',
                term: lunar.getJieQi(),
                shouldDo: this.translateArray(lunar.getDayYi()),
                shouldNotDo: this.translateArray(lunar.getDayJi()),
                auspiciousHours: this.getAuspiciousHours(lunar),
                departureHours: this.getDepartureHours(lunar)
            };
        } catch (error) {
            console.error('Error getting day details:', error);
            throw error;
        }
    }

    private getAuspiciousHours(lunar: Lunar) {
        const hourRanges: Record<string, string> = {
            'Tý': '23:00 - 01:00',
            'Sửu': '01:00 - 03:00',
            'Dần': '03:00 - 05:00',
            'Mão': '05:00 - 07:00',
            'Thìn': '07:00 - 09:00',
            'Tỵ': '09:00 - 11:00',
            'Ngọ': '11:00 - 13:00',
            'Mùi': '13:00 - 15:00',
            'Thân': '15:00 - 17:00',
            'Dậu': '17:00 - 19:00',
            'Tuất': '19:00 - 21:00',
            'Hợi': '21:00 - 23:00',
        };

        return (lunar as any).getTimes()
            .map((t: any) => {
                const zhi = t.getZhi();
                const type = (LunarVN as any)[t.getTianShenType()] || t.getTianShenType();
                return {
                    name: zhi,
                    time: hourRanges[zhi] || '',
                    tianShen: this.translate(t.getTianShen()),
                    type: type,
                    isAuspicious: t.getTianShenType() === '黄道' || t.getTianShenType() === '吉'
                };
            });
    }

    private getDepartureHours(lunar: Lunar) {
        const names = ['Đại An', 'Lưu Niên', 'Tốc Hỷ', 'Xích Khẩu', 'Tiểu Cát', 'Không Vong'];
        const hourRanges: Record<string, string> = {
            'Tý': '23:00 - 01:00', 'Sửu': '01:00 - 03:00', 'Dần': '03:00 - 05:00',
            'Mão': '05:00 - 07:00', 'Thìn': '07:00 - 09:00', 'Tỵ': '09:00 - 11:00',
            'Ngọ': '11:00 - 13:00', 'Mùi': '13:00 - 15:00', 'Thân': '15:00 - 17:00',
            'Dậu': '17:00 - 19:00', 'Tuất': '19:00 - 21:00', 'Hợi': '21:00 - 23:00',
        };

        const month = Math.abs(lunar.getMonth());
        const day = lunar.getDay();
        const branches = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

        return branches.map((zhi, index) => {
            const hourIndex = index + 1;
            const stateIndex = (month + day + hourIndex - 3) % 6;
            const name = names[stateIndex < 0 ? stateIndex + 6 : stateIndex];

            let liThuanKey = '';
            if (name === 'Đại An') liThuanKey = 'DAI_AN';
            else if (name === 'Lưu Niên') liThuanKey = 'LUU_NIEN';
            else if (name === 'Tốc Hỷ') liThuanKey = 'TOC_HY';
            else if (name === 'Xích Khẩu') liThuanKey = 'XICH_KHAU';
            else if (name === 'Tiểu Cát') liThuanKey = 'TIEU_CAT';
            else if (name === 'Không Vong') liThuanKey = 'KHONG_VONG';

            return {
                zhi,
                time: hourRanges[zhi],
                name,
                desc: (LunarVN as any)[liThuanKey] || ''
            };
        });
    }

    getLunarMonth(year: number, month: number) {
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const lastDayOfMonth = new Date(year, month, 0);
        const daysInMonth = lastDayOfMonth.getDate();

        const result = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const d = Solar.fromYmd(year, month, i);
            const l = d.getLunar();
            result.push({
                solarDay: i,
                lunarDay: l.getDay(),
                lunarMonth: l.getMonth(),
                isFirstLunar: l.getDay() === 1,
                isTerm: l.getJieQi() !== '',
                term: l.getJieQi(),
                dayOfWeek: d.getWeek(), // 0 for Sunday
            });
        }
        return result;
    }
}
