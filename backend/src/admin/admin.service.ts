import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import { Post, PostDocument } from '../community/schemas/post.schema';
import { TarotDeck, TarotDeckDocument } from '../tarot/schemas/tarot-deck.schema';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(TarotDeck.name) private deckModel: Model<TarotDeckDocument>,
    ) { }

    async getStats() {
        const [userCount, postCount, deckCount] = await Promise.all([
            this.userModel.countDocuments(),
            this.postModel.countDocuments(),
            this.deckModel.countDocuments(),
        ]);

        return {
            users: userCount,
            posts: postCount,
            decks: deckCount,
        };
    }

    async getAllUsers() {
        return this.userModel.find().select('-password -refreshToken').exec();
    }

    async updateDeck(id: string, updateData: any) {
        return this.deckModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }
}
