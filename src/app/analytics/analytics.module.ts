import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from '../../shared/entities/song.entity';
import { Stream } from '../../shared/entities/stream.entity';
import { User } from '../../shared/entities/user.entity';

@Module({
      imports: [
        TypeOrmModule.forFeature([Song, Stream, User]), 
      ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController]
})
export class AnalyticsModule {}
