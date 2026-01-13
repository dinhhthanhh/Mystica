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

        const prompt = this.aiService.buildTarotPrompt(deck.name, dto.spreadType, dto.question || '', cardsForAI);
        const aiInterpretation = await this.aiService.generateInterpretation(prompt);

        const reading = new this.readingModel({
            userId,
            deckId: deck._id,
            spreadType: dto.spreadType,
            question: dto.question,
            cards: pickedCards.map((card, index) => ({
                cardId: card._id,
                position: index + 1,
                isReversed: cardsForAI[index].isReversed,
                positionMeaning: cardsForAI[index].positionMeaning,
            })),
            aiInterpretation: aiInterpretation,
        });

        return reading.save();
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
