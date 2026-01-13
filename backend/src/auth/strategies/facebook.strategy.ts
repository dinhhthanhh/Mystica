import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.get<string>('FACEBOOK_APP_ID'),
            clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'),
            callbackURL: `${configService.get<string>('BACKEND_URL') || 'http://localhost:3001'}/api/auth/facebook/callback`,
            scope: ['email', 'public_profile'],
            profileFields: ['id', 'emails', 'name', 'photos'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (err: any, user: any, info?: any) => void,
    ): Promise<any> {
        const { name, emails, photos, id } = profile;
        const user = {
            facebookId: id,
            email: emails ? emails[0].value : undefined,
            name: `${name.givenName} ${name.familyName}`,
            avatar: photos ? photos[0].value : undefined,
            accessToken,
        };
        done(null, user);
    }
}
