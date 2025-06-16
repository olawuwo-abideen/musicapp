import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from '../../shared/entities/like.entity';
import { Repository } from 'typeorm';
import { Song } from '../../shared/entities/song.entity';
import { User } from '../../shared/entities/user.entity';

@Injectable()
export class LikeService {
constructor(
@InjectRepository(Song)
private songRepository: Repository<Song>,
@InjectRepository(User)
private userRepository: Repository<User>,
@InjectRepository(Like)
private likeRepository: Repository<Like>,
) {}

 async likeSong(songId: string, user: User) {
    const song = await this.songRepository.findOne({ where: { id: songId } });
    if (!song) throw new NotFoundException('Song not found');

    const alreadyLiked = await this.likeRepository.findOne({
      where: {
        song: { id: songId },
        user: { id: user.id },
      },
    });

    if (alreadyLiked) {
      throw new ConflictException('Song already liked');
    }

    const like = this.likeRepository.create({ song, user });
    await this.likeRepository.save(like);

    song.likeCount += 1;
    await this.songRepository.save(song);

    return { message: 'Song liked' };
  }

  async unlikeSong(songId: string, user: User) {
    const like = await this.likeRepository.findOne({
      where: {
        song: { id: songId },
        user: { id: user.id },
      },
      relations: ['song'], 
    });

    if (!like) throw new NotFoundException('Like not found');

    await this.likeRepository.remove(like);
    const song = await this.songRepository.findOne({ where: { id: songId } });
    if (song && song.likeCount > 0) {
      song.likeCount -= 1;
      await this.songRepository.save(song);
    }

    return { message: 'Song unliked' };
  }

  async getLikeCount(songId: string) {
    const song = await this.songRepository.findOne({ where: { id: songId } });
    if (!song) throw new NotFoundException('Song not found');

    return { songId, likeCount: song.likeCount };
  }




}
