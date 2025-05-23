import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateSongDTO, UpdateSongDto } from './dto/song-dto';
import { Song } from '../../shared/entities/song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Favorite } from '../../shared/entities/favorite.entity';
import { User } from '../../shared/entities/user.entity';


@Injectable()
export class SongsService {
constructor(
@InjectRepository(Song)
private songRepository: Repository<Song>,
@InjectRepository(Favorite)
private favoriteRepository: Repository<Favorite>,
) {}

public async createSong(data: CreateSongDTO): Promise<{ message: string; song: Song }> {
try {
const song = this.songRepository.create(data);
const savedSong = await this.songRepository.save(song);
return { message: 'Song created successfully', song: savedSong };
} catch (error) {
throw new InternalServerErrorException('Error creating song');
}
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




public async getSongs(): Promise<{ message: string; data: Song[] }> {
const songs = await this.songRepository.find();
return { message: 'Songs retrieved successfully', data: songs };

}


public async getSong(id: string): Promise<{ message: string; song: Song }> {
const song = await this.songRepository.findOne({ where: { id } });

if (!song) {
throw new NotFoundException(`Song with ID ${id} not found`);
}

return { message: 'Song retrieved successfully', song };
}


public async searchSongs(searchQuery: string | null): Promise<{ message: string; data: Song[] }> {
let songs: Song[];

if (!searchQuery) {
songs = await this.getSongs().then(response => response.data);
} else {
songs = await this.songRepository.find({
where: {
title: Like(`%${searchQuery}%`), 
},
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








async getFavorites(user: User): Promise<{ message: string; favorites?: Favorite[] }> {
  const favorites = await this.favoriteRepository.find({
    where: { user: { id: user.id } },
    relations: ['song'],
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
    
    

}
