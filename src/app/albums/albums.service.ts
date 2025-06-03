import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateAlbumDTO, UpdateAlbumDTO } from './dto/albums-dto';
import { Song } from '../../shared/entities/song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Artist } from '../../shared/entities/artist.entity';
import { Album } from 'src/shared/entities/album.entity';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';


@Injectable()
export class AlbumsService {
constructor(
@InjectRepository(Song)
private songRepository: Repository<Song>,
@InjectRepository(Artist)
private artistRepository: Repository<Artist>,
@InjectRepository(Album)
private albumRepository: Repository<Album>,
) {}

public async createAlbum(data: CreateAlbumDTO): Promise<{ message: string; album: Album }> {
  const artist = await this.artistRepository.findOneBy({ id: data.artistId });

  if (!artist) {
    throw new NotFoundException('Artist not found');
  }

  const album = this.albumRepository.create({
    title: data.title,
    releaseDate: data.releaseDate,
    coverImageUrl: data.coverImageUrl,
    artist
  });

  const savedAlbum = await this.albumRepository.save(album);

  return { message: 'Album created successfully', album: savedAlbum };
}



public async getAlbums(pagination: PaginationDto): Promise<{ message: string; data: Album[] }> {
  const { page = 1, pageSize = 10 } = pagination;

  const [data] = await this.albumRepository.findAndCount({
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return { message: 'Albums retrieved successfully', data };
}


public async updateAlbum(id: string, data: UpdateAlbumDTO): Promise<{ message: string; albums: Album }> {
const updateResult = await this.albumRepository.update(id, data);
if (updateResult.affected === 0) {
throw new NotFoundException(`Song with ID ${id} not found`);
}

const updatedSong = await this.albumRepository.findOne({ where: { id } });
return { message: 'Song updated successfully', albums: updatedSong };
}


public async deleteAlbum(id: string): Promise<{ message: string }> {
const album = await this.albumRepository.findOne({ where: { id } });
if (!album) {
throw new NotFoundException(`Album with ID ${id} not found`);
}

await this.albumRepository.delete(id);
return { message: 'Album deleted successfully' };
}

public async getAlbum(id: string): Promise<{ message: string; album: Album }> {
const album = await this.albumRepository.findOne({ where: { id } });

if (!album) {
throw new NotFoundException(`Album with ID ${id} not found`);
}

return { message: 'Album retrieved successfully', album };
}


public async searchAlbums(searchQuery: string | null, pagination: PaginationDto): Promise<{ message: string; data: Album[] }> {
  let albums: Album[];

  if (!searchQuery) {
    albums = await this.getAlbums(pagination).then(res => res.data);
  } else {
    albums = await this.albumRepository.find({
      where: {
        title: ILike(`%${searchQuery}%`),
      },
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    });
  }

  return { message: 'Albums retrieved successfully', data: albums };
}



async addSongToAlbum(songId: string, albumId: string): Promise<{ message: string; song?: Song }> {
  const song = await this.songRepository.findOne({
    where: { id: songId },
    relations: ['album']
  });
  if (!song) {
    throw new NotFoundException('Song not found');
  }

  if (song.album?.id === albumId) {
    return {
      message: 'Song is already part of this album',
      song,
    };
  }

  const album = await this.albumRepository.findOne({ where: { id: albumId } });
  if (!album) {
    throw new NotFoundException('Album not found');
  }

  song.album = album;
  const updatedSong = await this.songRepository.save(song);

  return {
    message: 'Song added to album successfully',
    song: updatedSong,
  };
}

async removeSongFromAlbum(albumId: string, songId: string): Promise<{ message: string }> {
  const song = await this.songRepository.findOne({
    where: { id: songId },
    relations: ['album'],
  });

  if (!song) {
    throw new NotFoundException(`Song with ID ${songId} not found`);
  }

  if (song.album?.id !== albumId) {
    throw new NotFoundException(`Song is not part of album ${albumId}`);
  }

  song.album = null;
  await this.songRepository.save(song);

  return { message: 'Song removed from album successfully' };
}


}




