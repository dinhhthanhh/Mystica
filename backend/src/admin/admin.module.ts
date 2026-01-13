import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User, UserSchema } from '../user/user.schema';
import { Post, PostSchema } from '../community/schemas/post.schema';
import { TarotDeck, TarotDeckSchema } from '../tarot/schemas/tarot-deck.schema';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Post.name, schema: PostSchema },
            { name: TarotDeck.name, schema: TarotDeckSchema },
        ]),
        UserModule,
    ],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
