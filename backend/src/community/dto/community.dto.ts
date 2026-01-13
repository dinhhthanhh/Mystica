import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
    @ApiProperty({ description: 'Tiêu đề bài viết' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Nội dung bài viết' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ description: 'Tags' })
    @IsArray()
    @IsOptional()
    tags?: string[];
}

export class CreateCommentDto {
    @ApiProperty({ description: 'Nội dung bình luận' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ description: 'ID bình luận cha (nếu là reply)' })
    @IsString()
    @IsOptional()
    parentId?: string;
}
