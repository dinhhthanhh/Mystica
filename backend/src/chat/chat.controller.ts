import { Controller, Post, Get, Delete, Body, UseGuards, Req, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
    constructor(private chatService: ChatService) { }

    @Post('oracle')
    @ApiOperation({ summary: 'Gửi tin nhắn cho AI Oracle' })
    async sendOracleMessage(@Req() req: any, @Body('content') content: string) {
        return this.chatService.sendOracleMessage(req.user.sub, content);
    }

    @Get('oracle/history')
    @ApiOperation({ summary: 'Lấy lịch sử chat với AI Oracle' })
    async getOracleHistory(@Req() req: any) {
        const room = await this.chatService.getOracleRoom(req.user.sub);
        return this.chatService.getMessages(room._id.toString());
    }

    @Delete('oracle/reset')
    @ApiOperation({ summary: 'Xóa lịch sử chat với AI Oracle' })
    async resetOracleChat(@Req() req: any) {
        return this.chatService.resetOracleChat(req.user.sub);
    }
}
