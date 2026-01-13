import { Controller, Get, UseGuards, Req, Inject, forwardRef } from '@nestjs/common';
import { AstrologyService } from './astrology.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Astrology')
@Controller('astrology')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AstrologyController {
    constructor(
        private astrologyService: AstrologyService,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
    ) { }

    @Get('profile')
    @ApiOperation({ summary: 'Lấy phân tích tử vi chi tiết' })
    async getAstrologyProfile(@Req() req: any) {
        const user = await this.userService.findById(req.user.sub);
        if (!user || !user.birthDate || !user.birthTime) {
            return { message: 'Vui lòng cập nhật ngày giờ sinh để xem tử vi' };
        }

        const calc = this.astrologyService.calculateBasicProfile(user.birthDate, user.birthTime);
        return {
            user: {
                name: user.name,
                birthDate: user.birthDate,
                birthTime: user.birthTime,
            },
            analysis: calc,
        };
    }
}
