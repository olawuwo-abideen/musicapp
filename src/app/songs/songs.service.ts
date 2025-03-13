import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSongDTO, UpdateSongDto } from './dto/song-dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { Song } from 'src/shared/entities/song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from 'typeorm';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  public async createSong(data: CreateSongDTO): Promise<Song> {
    const song = this.songRepository.create(data);
    return await this.songRepository.save(song);
  }

  public async updateSong(id: string, data: UpdateSongDto): Promise<Song> {
    const song = await this.songRepository.findOne({ where: { id } });
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    Object.assign(song, data);
    return await this.songRepository.save(song);
  }

  public async getSongs(paginationData: PaginationDto): Promise<{ data: Song[], total: number }> {
    const { page, pageSize } = paginationData;
    
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [data, total] = await this.songRepository.findAndCount({
      take, 
      skip, 
    });

    return { data, total };
  }

  public async searchSongs(searchQuery: string | null, paginationData: PaginationDto): Promise<{ data: Song[], total: number }> {
    const { page, pageSize } = paginationData;
    
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    if (!searchQuery) {
      return this.getSongs(paginationData);
    }

    const [data, total] = await this.songRepository.findAndCount({
      where: {
        title: Like(`%${searchQuery}%`), 
      },
      take, 
      skip, 
    });

    return { data, total };
  }


  public async deleteSong(id: string): Promise<void> {
    const song = await this.songRepository.findOne({ where: { id } });
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    await this.songRepository.delete(id);
  }
}
