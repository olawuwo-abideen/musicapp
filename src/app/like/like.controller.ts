import { Controller, Post, Delete, Param, Get } from '@nestjs/common';
import { LikeService } from './like.service';
import { IsValidUUIDPipe } from 'src/shared/pipes/is-valid-uuid.pipe';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/shared/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('likes')
@ApiTags('Like')
export class LikeController {
constructor(private readonly likeService: LikeService) {}

@Post(':songId')
@ApiOperation({ summary: 'Like a song' })
async like(
@CurrentUser() user: User,
@Param('songId') songId: string) {
return this.likeService.likeSong(songId, user);
}

@Delete(':songId')
@ApiOperation({ summary: 'Unlike a song' })
async unlike(
@CurrentUser() user: User,
@Param('songId') songId: string) {
return this.likeService.unlikeSong(songId, user);
}

@Get('count/:id')
@ApiOperation({ summary: 'Get song like' })
async getLikeCount(
@Param('id', IsValidUUIDPipe) id: string) {
return this.likeService.getLikeCount(id);
}

}
