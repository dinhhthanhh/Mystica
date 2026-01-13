import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReadingDto {
    @ApiProperty({ description: 'Slug của bộ bài' })
    @IsString()
    deckSlug: string;

    @ApiProperty({ description: 'Loại trải bài', enum: ['1-card', '3-card', 'celtic-cross'] })
    @IsEnum(['1-card', '3-card', 'celtic-cross'])
    spreadType: string;

    @ApiProperty({ description: 'Câu hỏi của người dùng' })
    @IsString()
    @IsOptional()
    question?: string;
}
