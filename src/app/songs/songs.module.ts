import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from '../../shared/entities/song.entity';
import { Favorite } from '../../shared/entities/favorite.entity';
import { User } from '../../shared/entities/user.entity';
import { Artist } from '../../shared/entities/artist.entity';
import { Album } from '../../shared/entities/album.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite, Song, User, Artist, Album]), 
  ],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
