import { Injectable } from '@nestjs/common';
import { Solar, Lunar } from 'lunar-javascript';
import { AiService } from '../ai/ai.service';

@Injectable()
export class AstrologyService {
    constructor(private aiService: AiService) { }

    /**
     * Tính toán thông tin huyền học cơ bản từ ngày giờ sinh
     */
    async calculateBasicProfile(birthDate: Date, birthTime: string) {
        const [hours, minutes] = birthTime.split(':').map(Number);
        const solar = Solar.fromYmdHms(
            birthDate.getFullYear(),
            birthDate.getMonth() + 1,
            birthDate.getDate(),
            hours,
            minutes,
            0,
        );
        const lunar = solar.getLunar();

        const basicInfo = {
            zodiacSign: this.getZodiacSign(birthDate),
            chineseZodiac: lunar.getYearShengXiao(),
            element: this.getElement(lunar.getYearNaYin()),
            destiny: lunar.getYearNaYin(),
            heavenlyStem: lunar.getYearGan(),
            earthlyBranch: lunar.getYearZhi(),
            lunarDate: `${lunar.getDay()} ${lunar.getMonthInChinese()} ${lunar.getYearInChinese()}`,
        };

        const prompt = this.aiService.buildAstrologyPrompt(basicInfo);
        const prediction = await this.aiService.generateInterpretation(prompt);

        return {
            ...basicInfo,
            prediction,
        };
    }

    private getZodiacSign(date: Date): string {
        const month = date.getMonth() + 1;
        const day = date.getDate();

        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Bạch Dương';
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Kim Ngưu';
        if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return 'Song Tử';
        if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return 'Cự Giải';
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Sư Tử';
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Xử Nữ';
        if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return 'Thiên Bình';
        if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return 'Thiên Yết';
        if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return 'Nhân Mã';
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Ma Kết';
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Bảo Bình';
        return 'Song Ngư';
    }

    private getElement(naYin: string): string {
        if (naYin.includes('Kim')) return 'Kim';
        if (naYin.includes('Mộc')) return 'Mộc';
        if (naYin.includes('Thủy')) return 'Thủy';
        if (naYin.includes('Hỏa')) return 'Hỏa';
        if (naYin.includes('Thổ')) return 'Thổ';
        return 'Chưa xác định';
    }
}
