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

    /**
     * Tính toán độ hợp giữa hai người dựa trên tuổi và mệnh
     */
    calculateCompatibility(date1: Date, time1: string, date2: Date, time2: string) {
        const profile1 = this.getBasicInfoSync(date1, time1);
        const profile2 = this.getBasicInfoSync(date2, time2);

        const zodiacCompat = this.getZodiacCompatibility(profile1.zodiacSign, profile2.zodiacSign);
        const chineseCompat = this.getChineseZodiacCompatibility(profile1.chineseZodiac, profile2.chineseZodiac);
        const elementCompat = this.getElementCompatibility(profile1.element, profile2.element);

        const overallScore = Math.round((zodiacCompat.score + chineseCompat.score + elementCompat.score) / 3);

        return {
            person1: profile1,
            person2: profile2,
            zodiacCompatibility: zodiacCompat,
            chineseZodiacCompatibility: chineseCompat,
            elementCompatibility: elementCompat,
            overallScore,
            overallDescription: this.getOverallCompatibilityDescription(overallScore),
        };
    }

    private getBasicInfoSync(birthDate: Date, birthTime: string) {
        const [hours, minutes] = birthTime.split(':').map(Number);
        const solar = Solar.fromYmdHms(
            birthDate.getFullYear(),
            birthDate.getMonth() + 1,
            birthDate.getDate(),
            hours || 12,
            minutes || 0,
            0,
        );
        const lunar = solar.getLunar();

        return {
            zodiacSign: this.getZodiacSign(birthDate),
            chineseZodiac: lunar.getYearShengXiao(),
            element: this.getElement(lunar.getYearNaYin()),
            destiny: lunar.getYearNaYin(),
            heavenlyStem: lunar.getYearGan(),
            earthlyBranch: lunar.getYearZhi(),
        };
    }

    private getZodiacCompatibility(sign1: string, sign2: string): { score: number; description: string } {
        const compatibilityMap: Record<string, string[]> = {
            'Bạch Dương': ['Sư Tử', 'Nhân Mã', 'Song Tử', 'Bảo Bình'],
            'Kim Ngưu': ['Xử Nữ', 'Ma Kết', 'Cự Giải', 'Song Ngư'],
            'Song Tử': ['Thiên Bình', 'Bảo Bình', 'Bạch Dương', 'Sư Tử'],
            'Cự Giải': ['Thiên Yết', 'Song Ngư', 'Kim Ngưu', 'Xử Nữ'],
            'Sư Tử': ['Bạch Dương', 'Nhân Mã', 'Song Tử', 'Thiên Bình'],
            'Xử Nữ': ['Kim Ngưu', 'Ma Kết', 'Cự Giải', 'Thiên Yết'],
            'Thiên Bình': ['Song Tử', 'Bảo Bình', 'Sư Tử', 'Nhân Mã'],
            'Thiên Yết': ['Cự Giải', 'Song Ngư', 'Xử Nữ', 'Ma Kết'],
            'Nhân Mã': ['Bạch Dương', 'Sư Tử', 'Thiên Bình', 'Bảo Bình'],
            'Ma Kết': ['Kim Ngưu', 'Xử Nữ', 'Thiên Yết', 'Song Ngư'],
            'Bảo Bình': ['Song Tử', 'Thiên Bình', 'Bạch Dương', 'Nhân Mã'],
            'Song Ngư': ['Cự Giải', 'Thiên Yết', 'Kim Ngưu', 'Ma Kết'],
        };

        const compatible = compatibilityMap[sign1] || [];
        if (compatible.includes(sign2)) {
            return { score: 85 + Math.floor(Math.random() * 10), description: `${sign1} và ${sign2} rất hợp nhau! Đây là cặp đôi lý tưởng.` };
        }
        if (sign1 === sign2) {
            return { score: 70 + Math.floor(Math.random() * 10), description: `Hai người cùng cung ${sign1}, hiểu nhau nhưng cũng dễ xung đột.` };
        }
        return { score: 50 + Math.floor(Math.random() * 20), description: `${sign1} và ${sign2} cần nỗ lực để hiểu nhau hơn.` };
    }

    private getChineseZodiacCompatibility(animal1: string, animal2: string): { score: number; description: string } {
        const compatGroups = [
            ['Chuột', 'Rồng', 'Khỉ'], // Tam hợp
            ['Trâu', 'Rắn', 'Gà'],
            ['Hổ', 'Ngựa', 'Chó'],
            ['Mèo', 'Dê', 'Lợn'],
        ];
        const conflictPairs: Record<string, string> = {
            'Chuột': 'Ngựa', 'Trâu': 'Dê', 'Hổ': 'Khỉ', 'Mèo': 'Gà',
            'Rồng': 'Chó', 'Rắn': 'Lợn', 'Ngựa': 'Chuột', 'Dê': 'Trâu',
            'Khỉ': 'Hổ', 'Gà': 'Mèo', 'Chó': 'Rồng', 'Lợn': 'Rắn',
        };

        // Check tam hợp
        for (const group of compatGroups) {
            if (group.includes(animal1) && group.includes(animal2)) {
                return { score: 90 + Math.floor(Math.random() * 8), description: `${animal1} và ${animal2} thuộc nhóm Tam Hợp, rất tốt cho hôn nhân và hợp tác!` };
            }
        }

        // Check xung khắc
        if (conflictPairs[animal1] === animal2) {
            return { score: 30 + Math.floor(Math.random() * 15), description: `${animal1} xung khắc với ${animal2}. Cần cẩn thận trong mối quan hệ.` };
        }

        return { score: 60 + Math.floor(Math.random() * 15), description: `${animal1} và ${animal2} có thể hòa hợp nếu cả hai cùng cố gắng.` };
    }

    private getElementCompatibility(elem1: string, elem2: string): { score: number; description: string; relation: string } {
        // Ngũ hành tương sinh: Kim sinh Thủy, Thủy sinh Mộc, Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim
        const generating: Record<string, string> = {
            'Kim': 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim'
        };
        // Ngũ hành tương khắc: Kim khắc Mộc, Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim
        const overcoming: Record<string, string> = {
            'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim'
        };

        if (elem1 === elem2) {
            return { score: 75, description: `Cả hai cùng mệnh ${elem1}, dễ hiểu và đồng cảm.`, relation: 'Bình Hòa' };
        }
        if (generating[elem1] === elem2) {
            return { score: 90, description: `${elem1} sinh ${elem2} - mối quan hệ tương sinh, hỗ trợ lẫn nhau.`, relation: 'Tương Sinh' };
        }
        if (generating[elem2] === elem1) {
            return { score: 85, description: `${elem2} sinh ${elem1} - được hỗ trợ và nuôi dưỡng.`, relation: 'Được Sinh' };
        }
        if (overcoming[elem1] === elem2) {
            return { score: 40, description: `${elem1} khắc ${elem2} - có thể xảy ra xung đột.`, relation: 'Tương Khắc' };
        }
        if (overcoming[elem2] === elem1) {
            return { score: 45, description: `${elem2} khắc ${elem1} - bạn có thể bị áp đảo.`, relation: 'Bị Khắc' };
        }
        return { score: 65, description: `${elem1} và ${elem2} tương đối hòa hợp.`, relation: 'Bình Thường' };
    }

    private getOverallCompatibilityDescription(score: number): string {
        if (score >= 85) return 'Cặp đôi thiên định! Hai người rất hợp nhau trên nhiều phương diện.';
        if (score >= 70) return 'Mối quan hệ tốt đẹp, có tiềm năng phát triển lâu dài.';
        if (score >= 55) return 'Cần nỗ lực và thấu hiểu để xây dựng mối quan hệ bền vững.';
        return 'Thử thách nhiều, nhưng tình yêu đích thực có thể vượt qua mọi khó khăn.';
    }

    /**
     * Tính số đường đời (Life Path Number) theo Numerology
     */
    calculateLifePathNumber(birthDate: Date): { number: number; meaning: string } {
        const dateStr = birthDate.toISOString().split('T')[0].replace(/-/g, '');
        let sum = dateStr.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
            sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        }

        const meanings: Record<number, string> = {
            1: 'Người lãnh đạo, độc lập, sáng tạo. Bạn có ý chí mạnh mẽ và khả năng tiên phong.',
            2: 'Người hợp tác, nhạy cảm, hòa giải. Bạn giỏi làm việc nhóm và tạo sự hài hòa.',
            3: 'Người sáng tạo, vui vẻ, giao tiếp. Bạn có khả năng nghệ thuật và biểu đạt.',
            4: 'Người thực tế, ổn định, chăm chỉ. Bạn xây dựng nền tảng vững chắc cho cuộc sống.',
            5: 'Người tự do, mạo hiểm, linh hoạt. Bạn thích thay đổi và trải nghiệm mới.',
            6: 'Người chăm sóc, trách nhiệm, gia đình. Bạn coi trọng tình yêu và sự hài hòa.',
            7: 'Người tâm linh, phân tích, nội tâm. Bạn tìm kiếm sự thật và hiểu biết sâu sắc.',
            8: 'Người tham vọng, quyền lực, thành công. Bạn có khả năng kinh doanh và quản lý.',
            9: 'Người nhân đạo, lý tưởng, bao dung. Bạn quan tâm đến cộng đồng và ý nghĩa lớn lao.',
            11: 'Số chủ: Trực giác mạnh, tâm linh cao, có khả năng truyền cảm hứng cho người khác.',
            22: 'Số chủ: Người xây dựng vĩ đại, có tầm nhìn và khả năng hiện thực hóa giấc mơ lớn.',
            33: 'Số chủ: Người thầy tâm linh, có khả năng chữa lành và hướng dẫn người khác.',
        };

        return { number: sum, meaning: meanings[sum] || 'Đang cập nhật ý nghĩa.' };
    }

    /**
     * Tính năm cá nhân (Personal Year)
     */
    calculatePersonalYear(birthDate: Date, year: number): { number: number; meaning: string } {
        const month = birthDate.getMonth() + 1;
        const day = birthDate.getDate();
        let sum = month + day + year;
        while (sum > 9) {
            sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        }

        const meanings: Record<number, string> = {
            1: 'Năm khởi đầu mới! Thời điểm tuyệt vời để bắt đầu dự án, thay đổi nghề nghiệp.',
            2: 'Năm hợp tác và kiên nhẫn. Tập trung vào các mối quan hệ và làm việc nhóm.',
            3: 'Năm sáng tạo và giao tiếp. Thể hiện bản thân, tận hưởng cuộc sống xã hội.',
            4: 'Năm xây dựng nền tảng. Làm việc chăm chỉ, tổ chức và kỷ luật.',
            5: 'Năm thay đổi và tự do. Sẵn sàng cho những cơ hội bất ngờ và du lịch.',
            6: 'Năm gia đình và trách nhiệm. Tập trung vào nhà cửa, tình yêu và chăm sóc.',
            7: 'Năm nội tâm và tâm linh. Thời gian suy ngẫm, học hỏi và phát triển bản thân.',
            8: 'Năm thành công và tài chính. Cơ hội thăng tiến và đạt được mục tiêu vật chất.',
            9: 'Năm hoàn thành và buông bỏ. Kết thúc chu kỳ cũ, chuẩn bị cho khởi đầu mới.',
        };

        return { number: sum, meaning: meanings[sum] || 'Đang cập nhật.' };
    }
}
