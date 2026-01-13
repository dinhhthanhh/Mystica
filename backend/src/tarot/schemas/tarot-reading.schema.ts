import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TarotReadingDocument = TarotReading & Document;

@Schema({ timestamps: true })
export class TarotReading {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TarotDeck', required: true })
    deckId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, enum: ['1-card', '3-card', 'celtic-cross'] })
    spreadType: string;

    @Prop()
    question: string;

    @Prop({
        type: [{
            cardId: { type: MongooseSchema.Types.ObjectId, ref: 'TarotCard' },
            position: Number,
            isReversed: Boolean,
            positionMeaning: String
        }]
    })
    cards: any[];

    @Prop()
    aiInterpretation: string;
}

export const TarotReadingSchema = SchemaFactory.createForClass(TarotReading);
