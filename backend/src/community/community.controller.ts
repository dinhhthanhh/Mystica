import { Controller, Get, Post, Body, Param, UseGuards, Req, Put, Delete } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreatePostDto, CreateCommentDto } from './dto/community.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Community')
@Controller('posts')
export class CommunityController {
    constructor(private communityService: CommunityService) { }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách bài viết' })
    findAll() {
        return this.communityService.findAllPosts();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Chi tiết bài viết' })
    findOne(@Param('id') id: string) {
        return this.communityService.findPostById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Tạo bài viết mới' })
    create(@Req() req: any, @Body() dto: CreatePostDto) {
        return this.communityService.createPost(req.user.sub, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/like')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Like bài viết' })
    like(@Req() req: any, @Param('id') id: string) {
        return this.communityService.likePost(req.user.sub, id);
    }

    @Get(':id/comments')
    @ApiOperation({ summary: 'Lấy bình luận của bài viết' })
    getComments(@Param('id') id: string) {
        return this.communityService.getCommentsByPost(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/comments')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Thêm bình luận mới' })
    addComment(@Req() req: any, @Param('id') id: string, @Body() dto: CreateCommentDto) {
        return this.communityService.addComment(req.user.sub, id, dto);
    }

    @Post(':id/share')
    @ApiOperation({ summary: 'Chia sẻ bài viết' })
    share(@Param('id') id: string) {
        return this.communityService.sharePost(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/save')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Lưu bài viết' })
    save(@Req() req: any, @Param('id') id: string) {
        return this.communityService.savePost(req.user.sub, id);
    }
}
