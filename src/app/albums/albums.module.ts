import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { Artist } from 'src/shared/entities/artist.entity';
import { Song } from 'src/shared/entities/song.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from 'src/shared/entities/album.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([Song,  Artist, Album]), 
    ],
  controllers: [AlbumsController],
  providers: [AlbumsService]
})
export class AlbumsModule {}
