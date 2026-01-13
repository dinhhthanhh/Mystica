import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ChatRoom', required: true, index: true })
    roomId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    senderId: MongooseSchema.Types.ObjectId;

    @Prop({ enum: ['user', 'ai'], required: true })
    senderType: string;

    @Prop({ required: true })
    content: string;

    @Prop({ type: Object })
    metadata: any;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
