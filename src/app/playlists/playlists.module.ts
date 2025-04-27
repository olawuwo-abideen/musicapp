import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayListsController } from './playlists.controller';
import { PlayListsService } from './playlists.service';
import { Playlist } from '../../shared/entities/playlist.entity';
import { Song } from '../../shared/entities/song.entity';
import { User } from '../../shared/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Playlist, Song, User]), 
  ],
  controllers: [PlayListsController],
  providers: [PlayListsService],
})
export class PlayListModule {}
