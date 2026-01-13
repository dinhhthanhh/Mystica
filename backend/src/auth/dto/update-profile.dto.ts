import { PartialType } from '@nestjs/swagger';
import { RegisterDto } from './auth.dto';
import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';

export class UpdateProfileDto extends PartialType(RegisterDto) {
    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsDateString()
    birthDate?: string;

    @IsOptional()
    @IsString()
    birthTime?: string;

    @IsOptional()
    @IsString()
    birthPlace?: string;

    @IsOptional()
    @IsEnum(['male', 'female', 'other'])
    gender?: string;
}
