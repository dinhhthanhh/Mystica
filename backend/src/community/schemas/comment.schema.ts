import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true, index: true })
    postId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    authorId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    content: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
    likes: MongooseSchema.Types.ObjectId[];

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Comment' })
    parentId: MongooseSchema.Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
