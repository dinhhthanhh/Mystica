import { Controller, Get, Param, Query } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
    constructor(private calendarService: CalendarService) { }

    @Get('day/:date')
    @ApiOperation({ summary: 'Lấy chi tiết ngày (YYYY-MM-DD)' })
    getDay(@Param('date') dateStr: string) {
        const date = new Date(dateStr);
        return this.calendarService.getDayDetails(date);
    }

    @Get('lunar')
    @ApiOperation({ summary: 'Lấy lịch âm theo tháng' })
    getLunarMonth(@Query('year') year: number, @Query('month') month: number) {
        return this.calendarService.getLunarMonth(Number(year), Number(month));
    }
}
