import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from 'src/shared/entities/song.entity';
import { Artists } from 'src/shared/entities/artist.entity';
@Module({
    imports: [
      TypeOrmModule.forFeature([Song, Artists]), 
    ],
  providers: [ArtistsService],
  controllers: [ArtistsController]
})
export class ArtistsModule {}
