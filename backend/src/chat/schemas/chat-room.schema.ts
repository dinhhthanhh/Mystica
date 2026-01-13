import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ChatRoomDocument = ChatRoom & Document;

@Schema({ timestamps: true })
export class ChatRoom {
    @Prop({ enum: ['oracle', 'community'], default: 'community' })
    type: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
    participants: MongooseSchema.Types.ObjectId[];

    @Prop()
    name: string;

    @Prop({
        type: {
            content: String,
            senderId: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
            createdAt: Date,
        },
    })
    lastMessage: any;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
