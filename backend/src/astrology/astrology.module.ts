import { Module, forwardRef } from '@nestjs/common';
import { AstrologyService } from './astrology.service';
import { AstrologyController } from './astrology.controller';
import { UserModule } from '../user/user.module';
import { AiModule } from '../ai/ai.module';

@Module({
    imports: [forwardRef(() => UserModule), AiModule],
    providers: [AstrologyService],
    controllers: [AstrologyController],
    exports: [AstrologyService],
})
export class AstrologyModule { }
