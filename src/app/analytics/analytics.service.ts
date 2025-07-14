import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from '../../shared/entities/song.entity';
import { Stream } from '../../shared/entities/stream.entity';
import { User } from '../../shared/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {
constructor(
@InjectRepository(Stream)
private streamRepository: Repository<Stream>,
@InjectRepository(Song)
private songsRepository: Repository<Song>,
) {}

async getUserStats(user: User) {
  const streams = await this.streamRepository.find({
    where: { user: { id: user.id } },
    relations: ['song'],
  });
  let totalSeconds = 0;
  for (const stream of streams) {
    const duration = stream.song.duration;
    if (duration instanceof Date) {
      const minutes = duration.getUTCMinutes();
      const seconds = duration.getUTCSeconds();
      totalSeconds += minutes * 60 + seconds;
    }
  }
  const hoursListened = totalSeconds / 3600;
  const genreCounts: Record<string, number> = {};
  for (const stream of streams) {
    const genre = stream.song.genre;
    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
  }
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);
  return {
    message: 'User listening stats retrieved successfully using actual song duration',
    hoursListened: Number(hoursListened.toFixed(2)),
    topGenres,
  };
}



async getArtistStats(id: string) {
const songs = await this.songsRepository.find({ where: { artist: { id: id } } });
const totalPlays = songs.reduce((sum, s) => sum + s.playCounter, 0);
return {
message: 'Artist statistics retrieved successfully',
totalSongs: songs.length,
totalPlays,
};
}



}
