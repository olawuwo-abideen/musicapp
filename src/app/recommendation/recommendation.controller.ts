import { Controller, Get } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/shared/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('recommendation')
@ApiTags('Recommendation')
export class RecommendationController {
constructor(private recommendationService: RecommendationService) {}

@Get('/trending')
@ApiOperation({ summary: 'Get trending songs' })
getTrending() {
return this.recommendationService.getTrendingSongs();
}

@Get('/songs')
@ApiOperation({ summary: 'Recommend songs' })
getRecommendedSongs(@CurrentUser() user: User) {
return this.recommendationService.getSongs(user);
}





}
