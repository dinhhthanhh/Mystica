import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(registerDto: RegisterDto) {
        const userExists = await this.userService.findByEmail(registerDto.email);
        if (userExists) {
            throw new BadRequestException('Email đã được sử dụng');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.userService.create({
            ...registerDto,
            password: hashedPassword,
        });

        const tokens = await this.getTokens(user._id.toString(), user.email);
        await this.userService.updateRefreshToken(user._id.toString(), tokens.refreshToken);

        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.userService.findByEmail(loginDto.email);
        if (!user || !user.password) {
            throw new UnauthorizedException('Thông tin đăng nhập không chính xác hoặc tài khoản này được tạo qua mạng xã hội');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
        }

        const tokens = await this.getTokens(user._id.toString(), user.email);
        await this.userService.updateRefreshToken(user._id.toString(), tokens.refreshToken);

        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }

    async logout(userId: string) {
        await this.userService.updateRefreshToken(userId, null);
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.userService.findById(userId);
        if (!user || !user.refreshToken) {
            throw new UnauthorizedException('Truy cập bị từ chối');
        }

        // Usually we would hash the refresh token in DB, but for simplicity here we check direct
        if (user.refreshToken !== refreshToken) {
            throw new UnauthorizedException('Truy cập bị từ chối');
        }

        const tokens = await this.getTokens(user._id.toString(), user.email);
        await this.userService.updateRefreshToken(user._id.toString(), tokens.refreshToken);

        return tokens;
    }

    async getTokens(userId: string, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId, email },
                {
                    secret: this.configService.get<string>('JWT_SECRET'),
                    expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
                },
            ),
            this.jwtService.signAsync(
                { sub: userId, email },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    sanitizeUser(user: any) {
        const userObj = user.toObject ? user.toObject() : user;
        delete userObj.password;
        delete userObj.refreshToken;
        return userObj;
    }

    async validateOAuthUser(profile: any) {
        let user = await this.userService.findByEmail(profile.email);

        if (!user) {
            // Check if user exists by social id
            if (profile.googleId) {
                user = await this.userService.findOne({ googleId: profile.googleId });
            } else if (profile.facebookId) {
                user = await this.userService.findOne({ facebookId: profile.facebookId });
            }
        }

        if (!user) {
            // Create new user for social login
            user = await this.userService.create({
                email: profile.email || `${profile.googleId || profile.facebookId}@mystica.com`,
                name: profile.name,
                avatar: profile.avatar,
                googleId: profile.googleId,
                facebookId: profile.facebookId,
                role: 'user',
            });
        } else {
            // Update existing user with social info if missing
            const updates: any = {};
            if (profile.googleId && !user.googleId) updates.googleId = profile.googleId;
            if (profile.facebookId && !user.facebookId) updates.facebookId = profile.facebookId;
            if (profile.avatar && !user.avatar) updates.avatar = profile.avatar;

            if (Object.keys(updates).length > 0) {
                user = await this.userService.update(user._id.toString(), updates);
            }
        }

        if (!user) {
            throw new UnauthorizedException('Không thể xác thực người dùng');
        }

        const tokens = await this.getTokens(user._id.toString(), user.email);
        await this.userService.updateRefreshToken(user._id.toString(), tokens.refreshToken);

        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
}
