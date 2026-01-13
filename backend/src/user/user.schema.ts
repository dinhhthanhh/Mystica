import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, index: true })
    email: string;

    @Prop()
    password?: string;

    @Prop({ required: true })
    name: string;

    @Prop()
    googleId?: string;

    @Prop()
    facebookId?: string;

    @Prop()
    avatar: string;

    @Prop()
    birthDate: Date;

    @Prop()
    birthTime: string; // "HH:mm"

    @Prop()
    birthPlace: string;

    @Prop({ enum: ['male', 'female', 'other'], default: 'other' })
    gender: string;

    // Calculated astrological fields
    @Prop()
    zodiacSign: string;

    @Prop()
    chineseZodiac: string;

    @Prop()
    element: string; // Ngũ hành

    @Prop()
    destiny: string; // Cung mệnh

    @Prop()
    heavenlyStem: string; // Thiên can

    @Prop()
    earthlyBranch: string; // Địa chi

    @Prop({ enum: ['user', 'admin'], default: 'user' })
    role: string;

    @Prop({ type: [{ type: String }] })
    savedPosts: string[];

    @Prop()
    refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
