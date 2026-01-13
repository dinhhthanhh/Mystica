import { Controller, Get, Put, Body, UseGuards, Req, Inject, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AstrologyService } from '../astrology/astrology.service';

@ApiTags('User')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
    constructor(
        private userService: UserService,
        @Inject(forwardRef(() => AstrologyService))
        private astrologyService: AstrologyService,
    ) { }

    @Get('profile')
    @ApiOperation({ summary: 'Lấy hồ sơ người dùng hiện tại' })
    async getProfile(@Req() req: any) {
        const user = await this.userService.findById(req.user.sub);
        if (!user) return { message: 'Không tìm thấy người dùng' };
        return this.sanitizeUser(user);
    }

    @Put('profile')
    @ApiOperation({ summary: 'Cập nhật hồ sơ người dùng' })
    async updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
        let user = await this.userService.findById(req.user.sub);
        if (!user) return { message: 'Không tìm thấy người dùng' };

        // Check if birth info changed
        const birthDateChanged = updateProfileDto.birthDate && updateProfileDto.birthDate !== user.birthDate?.toISOString();
        const birthTimeChanged = updateProfileDto.birthTime && updateProfileDto.birthTime !== user.birthTime;

        // Update basic info
        user = await this.userService.update(req.user.sub, updateProfileDto);
        if (!user) return { message: 'Cập nhật thất bại' };

        if ((birthDateChanged || birthTimeChanged) && user.birthDate && user.birthTime) {
            const astroData = this.astrologyService.calculateBasicProfile(user.birthDate, user.birthTime);
            user = await this.userService.update(req.user.sub, astroData as any);
        }

        return this.sanitizeUser(user);
    }

    private sanitizeUser(user: any) {
        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.refreshToken;
        return userObj;
    }
}
