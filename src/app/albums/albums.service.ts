import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateAlbumDTO, UpdateAlbumDTO } from './dto/albums-dto';
import { Song } from '../../shared/entities/song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Artist } from '../../shared/entities/artist.entity';
import { Album } from 'src/shared/entities/album.entity';


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
try {
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
const savedAlbum = await this.artistRepository.save(album);
return { message: 'Album created successfully', album: savedAlbum };
} catch (error) {
throw new InternalServerErrorException('Error creating album');
}
}


public async getAlbums(): Promise<{ message: string; data: Album[] }> {
const albums = await this.albumRepository.find();
return { message: 'Albums retrieved successfully', data: albums };
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


public async searchAlbums(searchQuery: string | null): Promise<{ message: string; data: Album[] }> {
let albums: Album[];

if (!searchQuery) {
albums = await this.getAlbums().then(response => response.data);
} else {
albums = await this.albumRepository.find({
where: {
title: Like(`%${searchQuery}%`), 
},
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

async removeSongFromAlbum(songId: string): Promise<{ message: string }> {
  const song = await this.songRepository.findOne({
    where: { id: songId },
    relations: ['album'],
  });

  if (!song) {
    throw new NotFoundException('Song not found');
  }

  if (!song.album) {
    return { message: 'Song is not associated with any album' };
  }

  song.album = null;
  await this.songRepository.save(song);

  return { message: 'Song removed from album successfully' };
}


}
