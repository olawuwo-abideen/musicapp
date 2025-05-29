import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateSongDTO, UpdateSongDto } from './dto/song-dto';
import { Song } from '../../shared/entities/song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Favorite } from '../../shared/entities/favorite.entity';
import { User } from '../../shared/entities/user.entity';
import { Artist } from '../../shared/entities/artist.entity';
import { Album } from 'src/shared/entities/album.entity';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

@Injectable()
export class SongsService {
constructor(
@InjectRepository(Song)
private songRepository: Repository<Song>,
@InjectRepository(Favorite)
private favoriteRepository: Repository<Favorite>,
@InjectRepository(Artist)
private artistRepository: Repository<Artist>,
@InjectRepository(Album)
private albumRepository: Repository<Album>,
) {}

public async createSong(data: CreateSongDTO): Promise<{ message: string; song: Song }> {
  const artist = await this.artistRepository.findOneBy({ id: data.artistId });
  if (!artist) {
    throw new NotFoundException('Artist not found');
  }

  const album = await this.albumRepository.findOneBy({ id: data.albumId });
  if (!album) {
    throw new NotFoundException('Album not found');
  }

  const song = this.songRepository.create({
    title: data.title,
    genre: data.genre,
    releasedDate: data.releasedDate,
    duration: data.duration,
    language: data.language,
    songUrl: data.songUrl,
    songImageUrl: data.songImageUrl,
    artist,
    album, 
  });

  const savedSong = await this.songRepository.save(song);

  return { message: 'Song created successfully', song: savedSong };
}

// public async updateSong(id: string, data: UpdateSongDto): Promise<{ message: string; song: Song }> {
// const song = await this.songRepository.findOne({ where: { id } });
// if (!song) {
// throw new NotFoundException(`Song with ID ${id} not found`);
// }

// Object.assign(song, data);
// const updatedSong = await this.songRepository.save(song);
// return { message: 'Song updated successfully', song: updatedSong };
// }


public async updateSong(id: string, data: UpdateSongDto): Promise<{ message: string; song: Song }> {
const updateResult = await this.songRepository.update(id, data);
if (updateResult.affected === 0) {
throw new NotFoundException(`Song with ID ${id} not found`);
}

const updatedSong = await this.songRepository.findOne({ where: { id } });
return { message: 'Song updated successfully', song: updatedSong };
}




public async getSongs(pagination: PaginationDto): Promise<{ message: string; data: Song[] }> {
  const { page = 1, pageSize = 10 } = pagination;

  const [data] = await this.songRepository.findAndCount({
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return { message: 'Songs retrieved successfully', data };
}


public async getSong(id: string): Promise<{ message: string; song: Song }> {
const song = await this.songRepository.findOne({ where: { id } });

if (!song) {
throw new NotFoundException(`Song with ID ${id} not found`);
}

return { message: 'Song retrieved successfully', song };
}


public async searchSongs(searchQuery: string | null, pagination: PaginationDto): Promise<{ message: string; data: Song[] }> {
  const { page = 1, pageSize = 10 } = pagination;
  let songs: Song[];

  if (!searchQuery) {
    songs = (await this.getSongs(pagination)).data;
  } else {
    songs = await this.songRepository.find({
      where: {
        title: Like(`%${searchQuery}%`),
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  return { message: 'Songs retrieved successfully', data: songs };
}


public async deleteSong(id: string): Promise<{ message: string }> {
const song = await this.songRepository.findOne({ where: { id } });
if (!song) {
throw new NotFoundException(`Song with ID ${id} not found`);
}

await this.songRepository.delete(id);
return { message: 'Song deleted successfully' };
}


async getFavorites(user: User, pagination: PaginationDto): Promise<{ message: string; favorites?: Favorite[] }> {
  const { page = 1, pageSize = 10 } = pagination;

  const [favorites, total] = await this.favoriteRepository.findAndCount({
    where: { user: { id: user.id } },
    relations: ['song'],
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  if (!favorites.length) {
    return { message: 'No favorite songs found' };
  }

  return {
    message: 'Favorite songs retrieved successfully',
    favorites,
  };
}




async addToFavorites(user: User, id: string): Promise<{ message: string; favorite?: Favorite }> {
const song = await this.songRepository.findOne({ where: { id } });

if (!song) {
throw new NotFoundException('Song not found');
}
const existingFavorite = await this.favoriteRepository.findOne({
where: {
user: { id: user.id },
song: { id },
},
relations: ['song'], 
});

if (existingFavorite) {
return {
message: 'Song is already in favorites',
favorite: existingFavorite,
};
}
const favorite = this.favoriteRepository.create({
song: { id },
user: { id: user.id },
});

const savedFavorite = await this.favoriteRepository.save(favorite);

return {
message: 'Song added to favorites successfully',
favorite: savedFavorite,
};
}


async removeFromFavorites(user: User, id: string): Promise<{ message: string }> {
const favorite = await this.favoriteRepository.findOne({
where: {
user: { id: user.id },
song: { id },
},
relations: ['user', 'song'],
});

if (!favorite) {
throw new NotFoundException('Song not found in favorite');
}

await this.favoriteRepository.remove(favorite);

return { message: 'Song removed from favorites successfully' };
}


async incrementPlayCounter(id: string) {
  const song = await this.songRepository.findOne({
    where: { id: id },
    relations: ['artist', 'album'],
  });

  if (!song) throw new NotFoundException('Song not found');

  await this.songRepository.increment({ id: id }, 'playCounter', 1);

  await this.artistRepository.increment({ id: song.artist.id }, 'playCounter', 1);

  if (song.album) {
    await this.albumRepository.increment({ id: song.album.id }, 'playCounter', 1);
  }

  const updatedSong = await this.songRepository.findOne({ where: { id: id } });

  return {
    message: 'Song played',
    playCount: updatedSong.playCounter,
  };
}



}
