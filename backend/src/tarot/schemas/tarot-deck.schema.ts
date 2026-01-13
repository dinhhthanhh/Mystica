import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TarotDeckDocument = TarotDeck & Document;

@Schema({ timestamps: true })
export class TarotDeck {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true, index: true })
    slug: string;

    @Prop()
    description: string;

    @Prop()
    style: string; // Classical, Modern, Mystical, etc.

    @Prop()
    imagePrefix: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: false })
    isPremium: boolean;
}

export const TarotDeckSchema = SchemaFactory.createForClass(TarotDeck);
