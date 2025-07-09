import { Body, Controller, Param, Post } from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { FeedbackDto, ReportSongDto } from './dto/feedback.dto';
import { User } from 'src/shared/entities/user.entity';
import { FeedbackService } from './feedback.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsValidUUIDPipe } from 'src/shared/pipes/is-valid-uuid.pipe';

@ApiBearerAuth()
@Controller('feedback')
@ApiTags('Feedback')
export class FeedbackController {
constructor(private readonly feedbackService: FeedbackService) {}



@Post('')
@ApiOperation({ summary: 'Submit feedback for the app' })
async submitFeedback(
@CurrentUser() user: User,
@Body() data: FeedbackDto,
) {
return this.feedbackService.submitFeedback(user, data, );
}

@Post('/report/song/:id')
@ApiOperation({ summary: 'Report a song' })
async reportSong(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) songId: string,
@Body() data: ReportSongDto,
) {
return this.feedbackService.reportSong(user, songId, data);
}




}
