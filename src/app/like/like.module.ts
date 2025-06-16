import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '../../shared/entities/like.entity';
import { Song } from '../../shared/entities/song.entity';
import { User } from '../../shared/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Song, User])],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
