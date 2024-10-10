import { Module } from '@nestjs/common';
import { PlayListsController } from './playlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Playlist } from './entity/playlist.entity';
import { PlayListsService } from './playlists.service';
import { Song } from 'src/songs/entity/song.entity';
import { User } from 'src/users/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Song, User])],
  controllers: [PlayListsController],
  providers: [PlayListsService],
})
export class PlayListModule {}
