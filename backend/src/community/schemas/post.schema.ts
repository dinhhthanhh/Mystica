import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
    authorId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop([String])
    tags: string[];

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
    likes: MongooseSchema.Types.ObjectId[];

    @Prop({ default: 0 })
    likesCount: number;

    @Prop({ default: 0 })
    commentsCount: number;

    @Prop({ default: 0 })
    sharesCount: number;

    @Prop({ default: true })
    isPublished: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
