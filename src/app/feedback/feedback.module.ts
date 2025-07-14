import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../shared/entities/user.entity';
import { Song } from '../../shared/entities/song.entity';
import { SongReport } from '../../shared/entities/report.entity';
import { Feedback } from '../../shared/entities/feedback.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([ Song, User, SongReport, Feedback]), 
    ],
  providers: [FeedbackService],
  controllers: [FeedbackController]
})
export class FeedbackModule {}
