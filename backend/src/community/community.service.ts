import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreatePostDto, CreateCommentDto } from './dto/community.dto';
import { NotificationService } from '../notification/notification.service';
import { User, UserDocument } from '../user/user.schema';

@Injectable()
export class CommunityService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private notificationService: NotificationService,
    ) { }

    async createPost(userId: string, dto: CreatePostDto) {
        const post = new this.postModel({
            ...dto,
            authorId: userId,
        });
        return post.save();
    }

    async findAllPosts() {
        return this.postModel.find({ isPublished: true })
            .populate('authorId', 'name avatar')
            .sort({ createdAt: -1 })
            .exec();
    }

    async findPostById(id: string) {
        const post = await this.postModel.findById(id).populate('authorId', 'name avatar').exec();
        if (!post) throw new NotFoundException('Không tìm thấy bài viết');
        return post;
    }

    async likePost(userId: string, postId: string) {
        const post = await this.postModel.findById(postId);
        if (!post) throw new NotFoundException('Không tìm thấy bài viết');

        const index = post.likes.indexOf(userId as any);
        if (index === -1) {
            post.likes.push(userId as any);
            post.likesCount++;

            // Trigger notification
            if (post.authorId.toString() !== userId) {
                await this.notificationService.create({
                    userId: post.authorId as any,
                    senderId: userId as any,
                    type: 'like',
                    content: 'đã thích bài viết của bạn',
                    relatedId: post._id as any,
                });
            }
        } else {
            post.likes.splice(index, 1);
            post.likesCount--;
        }
        return post.save();
    }

    async addComment(userId: string, postId: string, dto: CreateCommentDto) {
        const post = await this.postModel.findById(postId);
        if (!post) throw new NotFoundException('Không tìm thấy bài viết');

        const comment = new this.commentModel({
            ...dto,
            postId,
            authorId: userId,
        });
        await comment.save();

        post.commentsCount++;
        await post.save();

        // Trigger notification
        if (post.authorId.toString() !== userId) {
            await this.notificationService.create({
                userId: post.authorId as any,
                senderId: userId as any,
                type: 'comment',
                content: 'đã bình luận vào bài viết của bạn',
                relatedId: post._id as any,
            });
        }

        return comment;
    }

    async sharePost(postId: string) {
        return this.postModel.findByIdAndUpdate(postId, { $inc: { sharesCount: 1 } }, { new: true });
    }

    async savePost(userId: string, postId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('Không tìm thấy người dùng');

        const index = user.savedPosts.indexOf(postId);
        if (index === -1) {
            user.savedPosts.push(postId);
        } else {
            user.savedPosts.splice(index, 1);
        }
        await user.save();
        return user.savedPosts;
    }

    async getCommentsByPost(postId: string) {
        return this.commentModel.find({ postId })
            .populate('authorId', 'name avatar')
            .sort({ createdAt: 1 })
            .exec();
    }
}
