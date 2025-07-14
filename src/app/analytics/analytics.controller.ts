import { Controller, Get, Param } from '@nestjs/common';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../../shared/entities/user.entity';
import { AnalyticsService } from './analytics.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('analytics')
@ApiTags('Analytics')
export class AnalyticsController {
constructor(private analyticsService: AnalyticsService) {}


@Get('/user/stats')
@ApiOperation({ summary: 'Get user statistics' })
getUserStats(@CurrentUser() user: User) {
return this.analyticsService.getUserStats(user);
}

@Get('/artist/stats/:id')
@ApiOperation({ summary: 'Get artist statistics' })
getArtistStats(@Param('id') id: string) {
return this.analyticsService.getArtistStats(id);
}



}
