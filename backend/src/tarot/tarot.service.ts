import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TarotDeck, TarotDeckDocument } from './schemas/tarot-deck.schema';
import { TarotCard, TarotCardDocument } from './schemas/tarot-card.schema';
import { TarotReading, TarotReadingDocument } from './schemas/tarot-reading.schema';
import { CreateReadingDto } from './dto/tarot.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class TarotService {
    constructor(
        @InjectModel(TarotDeck.name) private deckModel: Model<TarotDeckDocument>,
        @InjectModel(TarotCard.name) private cardModel: Model<TarotCardDocument>,
        @InjectModel(TarotReading.name) private readingModel: Model<TarotReadingDocument>,
        private aiService: AiService,
    ) { }

    async getDecks() {
        return this.deckModel.find({ isActive: true }).exec();
    }

    async getDeckBySlug(slug: string) {
        const deck = await this.deckModel.findOne({ slug, isActive: true }).exec();
        if (!deck) throw new NotFoundException('Không tìm thấy bộ bài');
        return deck;
    }

    async getCardsByDeck(deckId: string) {
        return this.cardModel.find({ deckId }).sort({ number: 1 }).exec();
    }

    async createReading(userId: string, dto: CreateReadingDto) {
        const deck = await this.getDeckBySlug(dto.deckSlug);
        const allCards = await this.getCardsByDeck(deck._id.toString());

        // Shuffle and pick cards
        const count = this.getCardCountForSpread(dto.spreadType);
        const pickedCards = this.shuffleAndPick(allCards, count);

        const cardsForAI = pickedCards.map((card, index) => ({
            name: card.nameVi,
            positionMeaning: this.getPositionMeaning(dto.spreadType, index),
            isReversed: Math.random() > 0.7,
        }));

        // Try to get AI interpretation, fallback to default if fails
        let aiInterpretation: string;
        try {
            const prompt = this.aiService.buildTarotPrompt(deck.name, dto.spreadType, dto.question || '', cardsForAI);
            aiInterpretation = await this.aiService.generateInterpretation(prompt);
        } catch (error) {
            console.error('AI Tarot interpretation failed:', error);
            aiInterpretation = this.buildFallbackInterpretation(dto.spreadType, cardsForAI);
        }

        // Build card data with full info for frontend
        const cardsWithFullInfo = pickedCards.map((card, index) => ({
            cardId: card._id,
            position: index + 1,
            isReversed: cardsForAI[index].isReversed,
            positionMeaning: cardsForAI[index].positionMeaning,
            // Include full card data for frontend display
            cardData: {
                _id: card._id,
                name: card.name,
                nameVi: card.nameVi,
                imageUrl: card.imageUrl,
                meaningUpright: card.meaningUpright,
                meaningReversed: card.meaningReversed,
                keywords: card.keywords,
                arcana: card.arcana,
                suit: card.suit,
            }
        }));

        const reading = new this.readingModel({
            userId,
            deckId: deck._id,
            spreadType: dto.spreadType,
            question: dto.question,
            cards: cardsWithFullInfo.map(c => ({
                cardId: c.cardId,
                position: c.position,
                isReversed: c.isReversed,
                positionMeaning: c.positionMeaning,
            })),
            aiInterpretation: aiInterpretation,
        });

        const savedReading = await reading.save();

        // Return reading with full card data for immediate frontend use
        return {
            ...savedReading.toObject(),
            cards: cardsWithFullInfo,
        };
    }

    private buildFallbackInterpretation(spreadType: string, cards: any[]): string {
        const cardList = cards.map(c => `• ${c.positionMeaning}: ${c.name} (${c.isReversed ? 'Ngược' : 'Xuôi'})`).join('\n');
        return `🔮 **Các lá bài đã được rút:**\n${cardList}\n\n` +
            `📖 **Diễn giải:**\n` +
            `Các lá bài cho thấy một bức tranh đa chiều về tình huống của bạn. ` +
            `Mỗi lá bài mang một thông điệp riêng, hãy suy ngẫm về ý nghĩa của chúng trong bối cảnh câu hỏi của bạn.\n\n` +
            `⚠️ Kết quả chỉ mang tính chất tham khảo.\n\n` +
            `_Lưu ý: Diễn giải AI tạm thời không khả dụng. Vui lòng tham khảo ý nghĩa từng lá bài để hiểu rõ hơn._`;
    }

    private shuffleAndPick(cards: TarotCardDocument[], count: number) {
        const shuffled = [...cards].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    private getCardCountForSpread(type: string): number {
        switch (type) {
            case '1-card': return 1;
            case '3-card': return 3;
            case 'celtic-cross': return 10;
            default: return 1;
        }
    }

    private getPositionMeaning(spreadType: string, index: number): string {
        if (spreadType === '3-card') {
            const meanings = ['Quá khứ', 'Hiện tại', 'Tương lai'];
            return meanings[index];
        }
        return `Vị trí ${index + 1}`;
    }
}
