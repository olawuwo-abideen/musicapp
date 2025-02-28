import { Module } from '@nestjs/common';
import { PlayListsController } from './playlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Playlist } from '../../shared/entities/playlist.entity';
import { PlayListsService } from './playlists.service';
import { Song } from 'src/shared/entities/song.entity';
import { User } from 'src/shared/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Song, User])],
  controllers: [PlayListsController],
  providers: [PlayListsService],
})
export class PlayListModule {}
