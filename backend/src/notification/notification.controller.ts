import { Controller, Get, Patch, Param, UseGuards, Req, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách thông báo của tôi' })
    getMyNotifications(@Req() req: any) {
        return this.notificationService.findAllForUser(req.user.sub);
    }

    @Patch(':id/read')
    @ApiOperation({ summary: 'Đánh dấu đã đọc một thông báo' })
    markAsRead(@Param('id') id: string) {
        return this.notificationService.markAsRead(id);
    }

    @Post('read-all')
    @ApiOperation({ summary: 'Đánh dấu đã đọc tất cả thông báo' })
    markAllAsRead(@Req() req: any) {
        return this.notificationService.markAllAsRead(req.user.sub);
    }
}
