import { Controller, Get, Post, Body, Query, UseGuards, Req, Inject, forwardRef } from '@nestjs/common';
import { AstrologyService } from './astrology.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Astrology')
@Controller('astrology')
export class AstrologyController {
    constructor(
        private astrologyService: AstrologyService,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Lấy phân tích tử vi chi tiết' })
    async getAstrologyProfile(@Req() req: any) {
        const user = await this.userService.findById(req.user.sub);
        if (!user || !user.birthDate || !user.birthTime) {
            return { message: 'Vui lòng cập nhật ngày giờ sinh để xem tử vi' };
        }

        const calc = await this.astrologyService.calculateBasicProfile(user.birthDate, user.birthTime);
        return {
            user: {
                name: user.name,
                birthDate: user.birthDate,
                birthTime: user.birthTime,
            },
            analysis: calc,
        };
    }

    @Post('compatibility')
    @ApiOperation({ summary: 'Tính độ hợp giữa hai người (Tuổi hợp, Mệnh hợp)' })
    calculateCompatibility(@Body() body: {
        date1: string;
        time1?: string;
        date2: string;
        time2?: string;
    }) {
        const d1 = new Date(body.date1);
        const d2 = new Date(body.date2);
        return this.astrologyService.calculateCompatibility(
            d1, body.time1 || '12:00',
            d2, body.time2 || '12:00'
        );
    }

    @Get('numerology')
    @ApiOperation({ summary: 'Tính số đường đời (Life Path Number)' })
    @ApiQuery({ name: 'birthDate', required: true, description: 'Ngày sinh (YYYY-MM-DD)' })
    calculateNumerology(@Query('birthDate') birthDate: string) {
        const date = new Date(birthDate);
        const lifePath = this.astrologyService.calculateLifePathNumber(date);
        const currentYear = new Date().getFullYear();
        const personalYear = this.astrologyService.calculatePersonalYear(date, currentYear);

        return {
            birthDate,
            lifePathNumber: lifePath,
            personalYear: {
                year: currentYear,
                ...personalYear,
            },
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-numerology')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Xem số học cá nhân của bạn' })
    async getMyNumerology(@Req() req: any) {
        const user = await this.userService.findById(req.user.sub);
        if (!user || !user.birthDate) {
            return { message: 'Vui lòng cập nhật ngày sinh để xem số học' };
        }

        const lifePath = this.astrologyService.calculateLifePathNumber(user.birthDate);
        const currentYear = new Date().getFullYear();
        const personalYear = this.astrologyService.calculatePersonalYear(user.birthDate, currentYear);

        return {
            user: { name: user.name, birthDate: user.birthDate },
            lifePathNumber: lifePath,
            personalYear: {
                year: currentYear,
                ...personalYear,
            },
        };
    }

    @Get('personal-year')
    @ApiOperation({ summary: 'Tính năm cá nhân cho một năm cụ thể' })
    @ApiQuery({ name: 'birthDate', required: true })
    @ApiQuery({ name: 'year', required: true })
    calculatePersonalYear(
        @Query('birthDate') birthDate: string,
        @Query('year') year: string
    ) {
        const date = new Date(birthDate);
        const yearNum = parseInt(year);
        return this.astrologyService.calculatePersonalYear(date, yearNum);
    }
}

