import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not defined in environment variables');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }

    async generateInterpretation(prompt: string): Promise<string> {
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw new InternalServerErrorException('AI đang bận, vui lòng thử lại sau');
        }
    }

    // Pre-defined prompt builders
    buildTarotPrompt(deckName: string, spreadType: string, question: string, cards: any[]) {
        const cardDetails = cards.map(c =>
            `- ${c.positionMeaning}: Lá ${c.name} (${c.isReversed ? 'Ngược' : 'Xuôi'})`
        ).join('\n');

        return `
      Bạn là "Mystica Oracle" - nhà tiên tri huyền bí.
      Người dùng sử dụng bộ bài: ${deckName}.
      Loại trải bài: ${spreadType}.
      Câu hỏi: ${question || 'Không rõ'}.
      Danh sách lá bài:
      ${cardDetails}

      Hãy đưa ra diễn giải chi tiết, sâu sắc và huyền bí bằng tiếng Việt. 
      Lưu ý: Luôn kết thúc bằng disclaimer: "⚠️ Kết quả chỉ mang tính chất tham khảo."
    `;
    }

    buildAstrologyPrompt(profile: any) {
        return `
      Bạn là "Mystica Astrologer" - chuyên gia tử vi và chiêm tinh.
      Thông tin người dùng:
      - Cung hoàng đạo: ${profile.zodiacSign}
      - Con giáp: ${profile.chineseZodiac}
      - Mệnh: ${profile.destiny}
      - Thiên can: ${profile.heavenlyStem}
      - Địa chi: ${profile.earthlyBranch}
      
      Hãy đưa ra dự đoán tổng quan về vận mệnh, tính cách, sự nghiệp và tình duyên của người này trong năm nay bằng tiếng Việt.
      Văn phong huyền bí, chuyên nghiệp và sâu sắc. Chia thành các mục rõ ràng.
      Lưu ý: Luôn kết thúc bằng disclaimer: "⚠️ Kết quả chỉ mang tính chất tham khảo."
    `;
    }
}
