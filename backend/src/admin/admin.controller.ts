import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Thống kê hệ thống' })
    getStats() {
        return this.adminService.getStats();
    }

    @Get('users')
    @ApiOperation({ summary: 'Danh sách người dùng' })
    getUsers() {
        return this.adminService.getAllUsers();
    }

    @Put('decks/:id')
    @ApiOperation({ summary: 'Cập nhật bộ bài' })
    updateDeck(@Param('id') id: string, @Body() updateData: any) {
        return this.adminService.updateDeck(id, updateData);
    }
}
