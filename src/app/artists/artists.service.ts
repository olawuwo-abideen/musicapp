import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateArtistDTO, UpdateArtistDTO } from './dto/artist-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Artists } from '../../shared/entities/artist.entity';


@Injectable()
export class ArtistsService {
constructor(
@InjectRepository(Artists)
private artistRepository: Repository<Artists>,
) {}

public async createArtist(data: CreateArtistDTO): Promise<{ message: string; artist: Artists }> {
try {
const artist = this.artistRepository.create(data);
const savedArtist = await this.artistRepository.save(artist);
return { message: 'Artist created successfully', artist: savedArtist };
} catch (error) {
throw new InternalServerErrorException('Error creating song');
}
}


public async getArtists(): Promise<{ message: string; data: Artists[] }> {
const artists = await this.artistRepository.find();
return { message: 'Artists retrieved successfully', data: artists };

}


public async getArtist(id: string): Promise<{ message: string; artists: Artists }> {
const artists = await this.artistRepository.findOne({ where: { id } });

if (!artists) {
throw new NotFoundException(`Artist with ID ${id} not found`);
}

return { message: 'Artist retrieved successfully', artists };
}


public async updateArtist(id: string, data: UpdateArtistDTO): Promise<{ message: string; artist: Artists }> {
  const updateResult = await this.artistRepository.update(id, data);
  if (updateResult.affected === 0) {
    throw new NotFoundException(`Artist with ID ${id} not found`);
  }

  const updatedArtist = await this.artistRepository.findOne({ where: { id } });
  return { message: 'Artist updated successfully', artist: updatedArtist };
}

public async searchArtistByName(searchQuery: string | null): Promise<{ message: string; data: Artists[] }> {
  let artists: Artists[];

  if (!searchQuery) {
    const response = await this.getArtists(); 
    artists = response.data;
  } else {
    artists = await this.artistRepository.find({
      where: {
        artistName: Like(`%${searchQuery}%`),
      },
    });
  }

  return { message: 'Artists retrieved successfully', data: artists };
}



public async deleteArtist(id: string): Promise<{ message: string }> {
const artist = await this.artistRepository.findOne({ where: { id } });
if (!artist) {
throw new NotFoundException(`Artist with ID ${id} not found`);
}

await this.artistRepository.delete(id);
return { message: 'Artist deleted successfully' };
}

}
