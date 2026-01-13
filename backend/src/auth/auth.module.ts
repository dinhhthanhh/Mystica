import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
    imports: [UserModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        RefreshTokenStrategy,
        GoogleStrategy,
        FacebookStrategy,
    ],
})
export class AuthModule { }
