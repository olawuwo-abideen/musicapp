import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from '../../shared/entities/song.entity';
import { Favorite } from '../../shared/entities/favorite.entity';
import { User } from '../../shared/entities/user.entity';
import { Artists } from 'src/shared/entities/artist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite, Song, User, Artists]), 
  ],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
