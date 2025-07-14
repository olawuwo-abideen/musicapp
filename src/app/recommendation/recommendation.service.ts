import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre, Song } from '../../shared/entities/song.entity';
import { Stream } from '../../shared/entities/stream.entity';
import { User } from '../../shared/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecommendationService {
constructor(
@InjectRepository(Stream)
private streamRepository: Repository<Stream>,
@InjectRepository(Song)
private songsRepository: Repository<Song>,
) {}






async getSongs(user: User) {
    const streams = await this.streamRepository.find({
      where: { user: { id: user.id } },
      relations: ['song'],
    });
    if (streams.length === 0) {
      return this.songsRepository.find({ order: { playCounter: 'DESC' }, take: 10 });
    }
    const genreCount: Record<string, number> = {};
    for (const stream of streams) {
      const genre = stream.song.genre;
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    }
    const topGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0];

    if (!topGenre) {
      return this.songsRepository.find({ order: { playCounter: 'DESC' }, take: 10 });
    }
    const recommended = await this.songsRepository.find({
      where: { genre: topGenre as Genre },
      order: { playCounter: 'DESC' },
      take: 10,
    });
    return {
      message: `Recommended songs based on your listening to ${topGenre}`,
      recommended,
    };
  }






async getTrendingSongs() {
  return this.songsRepository.find({ order: { playCounter: 'DESC' }, take: 10 })
}



}