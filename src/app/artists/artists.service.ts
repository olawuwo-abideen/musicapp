import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateArtistDTO, UpdateArtistDTO } from './dto/artist-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Artist } from '../../shared/entities/artist.entity';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';


@Injectable()
export class ArtistsService {
constructor(
@InjectRepository(Artist)
private artistRepository: Repository<Artist>,
) {}

public async createArtist(data: CreateArtistDTO): Promise<{ message: string; artist: Artist }> {
  const artist = this.artistRepository.create(data);
  const savedArtist = await this.artistRepository.save(artist);
  return { message: 'Artist created successfully', artist: savedArtist };
}



public async getArtists(pagination: PaginationDto): Promise<{ message: string; data: Artist[] }> {
  const { page = 1, pageSize = 10 } = pagination;

  const [data] = await this.artistRepository.findAndCount({
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return { message: 'Artists retrieved successfully', data };
}


public async getArtist(id: string): Promise<{ message: string; artists: Artist }> {
const artists = await this.artistRepository.findOne({ where: { id } });

if (!artists) {
throw new NotFoundException(`Artist with ID ${id} not found`);
}

return { message: 'Artist retrieved successfully', artists };
}


public async updateArtist(id: string, data: UpdateArtistDTO): Promise<{ message: string; artist: Artist }> {
  const updateResult = await this.artistRepository.update(id, data);
  if (updateResult.affected === 0) {
    throw new NotFoundException(`Artist with ID ${id} not found`);
  }

  const updatedArtist = await this.artistRepository.findOne({ where: { id } });
  return { message: 'Artist updated successfully', artist: updatedArtist };
}

public async searchArtistByName(searchQuery: string | null, pagination: PaginationDto): Promise<{ message: string; data: Artist[] }> {
  const { page = 1, pageSize = 10 } = pagination;
  let artists: Artist[];

  if (!searchQuery) {
    const response = await this.getArtists(pagination); 
    artists = response.data;
  } else {
    artists = await this.artistRepository.find({
      where: {
        artistName: ILike(`%${searchQuery}%`),
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
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


async getTopArtists(limit: number = 10): Promise<{ message: string; data: Artist[] }> {
  const topArtists = await this.artistRepository.find({
    order: { playCounter: 'DESC' },
    take: limit,
  });

  return {
    message: 'Top artists by total song plays',
    data: topArtists,
  };
}






}
