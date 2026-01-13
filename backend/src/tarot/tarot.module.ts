import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TarotService } from './tarot.service';
import { TarotController } from './tarot.controller';
import { TarotDeck, TarotDeckSchema } from './schemas/tarot-deck.schema';
import { TarotCard, TarotCardSchema } from './schemas/tarot-card.schema';
import { TarotReading, TarotReadingSchema } from './schemas/tarot-reading.schema';
import { AiModule } from '../ai/ai.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: TarotDeck.name, schema: TarotDeckSchema },
            { name: TarotCard.name, schema: TarotCardSchema },
            { name: TarotReading.name, schema: TarotReadingSchema },
        ]),
        AiModule,
    ],
    controllers: [TarotController],
    providers: [TarotService],
    exports: [TarotService],
})
export class TarotModule { }
