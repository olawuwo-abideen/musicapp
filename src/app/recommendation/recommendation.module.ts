import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from 'src/shared/entities/song.entity';
import { User } from 'src/shared/entities/user.entity';
import { Stream } from 'src/shared/entities/stream.entity';

@Module({
      imports: [
        TypeOrmModule.forFeature([Song, User, Stream]), 
      ],
  providers: [RecommendationService],
  controllers: [RecommendationController]
})
export class RecommendationModule {}
