import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AstrologyModule } from './astrology/astrology.module';
import { CalendarModule } from './calendar/calendar.module';
import { TarotModule } from './tarot/tarot.module';
import { AiModule } from './ai/ai.module';
import { ChatModule } from './chat/chat.module';
import { CommunityModule } from './community/community.module';
import { AdminModule } from './admin/admin.module';
import { NotificationModule } from './notification/notification.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        UserModule,
        AstrologyModule,
        CalendarModule,
        TarotModule,
        AiModule,
        ChatModule,
        CommunityModule,
        AdminModule,
        NotificationModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
