import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { TarotService } from './tarot.service';
import { CreateReadingDto } from './dto/tarot.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tarot')
@Controller('tarot')
export class TarotController {
    constructor(private tarotService: TarotService) { }

    @Get('decks')
    @ApiOperation({ summary: 'Danh sách bộ bài Tarot' })
    getDecks() {
        return this.tarotService.getDecks();
    }

    @Get('decks/:slug')
    @ApiOperation({ summary: 'Chi tiết bộ bài theo slug' })
    getDeck(@Param('slug') slug: string) {
        return this.tarotService.getDeckBySlug(slug);
    }

    @UseGuards(JwtAuthGuard)
    @Post('readings')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Tạo lượt rút bài Tarot mới' })
    createReading(@Req() req: any, @Body() dto: CreateReadingDto) {
        return this.tarotService.createReading(req.user.sub, dto);
    }
}
