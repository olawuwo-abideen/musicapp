import { Controller, Post, Delete, Get, Param } from '@nestjs/common';
import { FollowerService } from './follower.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../../shared/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('follow')
@ApiTags('Follow')
export class FollowerController {
constructor(private readonly followerService: FollowerService) {}

@Post(':artistId')
@ApiOperation({ summary: 'Follow an artist' })
async follow(
@CurrentUser() user: User,
@Param('artistId') artistId: string) {
return this.followerService.followArtist(artistId, user);
}

@Delete(':artistId')
@ApiOperation({ summary: 'Unfollow an artist' })
async unfollow(
@CurrentUser() user: User,
@Param('artistId') artistId: string) {
return this.followerService.unfollowArtist(artistId, user);
}

@Get(':artistId/followers')
@ApiOperation({ summary: 'Get artist follower' })
async count(@Param('artistId') artistId: string) {
return this.followerService.countFollowers(artistId);
}

}
