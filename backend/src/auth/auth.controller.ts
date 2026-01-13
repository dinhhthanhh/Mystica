import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) { }

    @Post('register')
    @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Đăng nhập' })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Đăng xuất' })
    logout(@Req() req: any) {
        return this.authService.logout(req.user.sub);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Lấy access token mới từ refresh token' })
    refreshTokens(@Req() req: any) {
        const userId = req.user.sub;
        const refreshToken = req.user.refreshToken;
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Lấy thông tin user hiện tại' })
    getMe(@Req() req: any) {
        return req.user;
    }

    // Google Auth
    @Get('google')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Đăng nhập bằng Google' })
    async googleAuth(@Req() req: any) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Callback từ Google' })
    async googleAuthRedirect(@Req() req: any, @Res() res: any) {
        const result = await this.authService.validateOAuthUser(req.user);
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        return res.redirect(`${frontendUrl}/auth/callback?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`);
    }

    // Facebook Auth
    @Get('facebook')
    @UseGuards(AuthGuard('facebook'))
    @ApiOperation({ summary: 'Đăng nhập bằng Facebook' })
    async facebookAuth(@Req() req: any) { }

    @Get('facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    @ApiOperation({ summary: 'Callback từ Facebook' })
    async facebookAuthRedirect(@Req() req: any, @Res() res: any) {
        const result = await this.authService.validateOAuthUser(req.user);
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        return res.redirect(`${frontendUrl}/auth/callback?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`);
    }
}
