import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TarotDeck } from './tarot-deck.schema';

export type TarotCardDocument = TarotCard & Document;

@Schema()
export class TarotCard {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TarotDeck', required: true, index: true })
    deckId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    nameVi: string;

    @Prop({ required: true })
    number: number;

    @Prop({ required: true, enum: ['major', 'minor'] })
    arcana: string;

    @Prop({ enum: ['Wands', 'Cups', 'Swords', 'Pentacles', null] })
    suit: string;

    @Prop()
    imageUrl: string;

    @Prop([String])
    keywords: string[];

    @Prop()
    meaningUpright: string;

    @Prop()
    meaningReversed: string;

    @Prop()
    description: string;

    @Prop()
    advice: string;
}

export const TarotCardSchema = SchemaFactory.createForClass(TarotCard);
