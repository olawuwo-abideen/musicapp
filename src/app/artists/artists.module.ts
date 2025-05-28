import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from 'src/shared/entities/song.entity';
import { Album } from 'src/shared/entities/album.entity';
import { Artist } from 'src/shared/entities/artist.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([Song, Artist, Album]), 
    ],
  providers: [ArtistsService],
  controllers: [ArtistsController]
})
export class ArtistsModule {}
