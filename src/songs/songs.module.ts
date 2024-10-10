import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entity/song.entity';
import { Artist } from 'src/artists/entity/artists.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist])],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
