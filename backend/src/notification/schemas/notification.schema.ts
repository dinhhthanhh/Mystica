import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', index: true })
    senderId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, enum: ['like', 'comment', 'system', 'follow'] })
    type: string;

    @Prop({ required: true })
    content: string;

    @Prop({ type: MongooseSchema.Types.ObjectId })
    relatedId: MongooseSchema.Types.ObjectId; // E.g. Post ID

    @Prop({ default: false })
    isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
