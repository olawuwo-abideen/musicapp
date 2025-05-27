import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { CreateSongDTO, UpdateSongDto } from './dto/song-dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager'; 
import { Reflector } from '@nestjs/core';
import { Genre } from '../../shared/entities/song.entity';
import { User } from '../../shared/entities/user.entity';

describe('SongsController', () => {
  let controller: SongsController;
  let service: SongsService;

  const mockUser = { id: 'user-id' } as User;

  const mockService = {
    createSong: jest.fn(),
    getSongs: jest.fn(),
    getFavorites: jest.fn(),
    updateSong: jest.fn(),
    getSong: jest.fn(),
    searchSongs: jest.fn(),
    deleteSong: jest.fn(),
    addToFavorites: jest.fn(),
    removeFromFavorites: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        { provide: SongsService, useValue: mockService },
        { provide: CACHE_MANAGER, useValue: {} }, 
        { provide: Reflector, useValue: { get: () => null } }, 
      ],
    }).compile();

    controller = module.get<SongsController>(SongsController);
    service = module.get<SongsService>(SongsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call createSong with DTO', async () => {
    const dto: CreateSongDTO = {
      title: 'Test',
      artists: 'Artist',
      releasedDate: new Date(),
      duration: new Date(),
      genre: Genre.POP,
    };
    await controller.createSong(dto);
    expect(service.createSong).toHaveBeenCalledWith(dto);
  });

  it('should call getSongs', async () => {
    await controller.getSongs();
    expect(service.getSongs).toHaveBeenCalled();
  });

  it('should call getFavorites with user', async () => {
    await controller.getFavorites(mockUser);
    expect(service.getFavorites).toHaveBeenCalledWith(mockUser);
  });

  it('should call updateSong with id and DTO', async () => {
    const id = 'song-id';
    const dto: UpdateSongDto = {
      title: 'Updated',
      artists: 'Artist',
      releasedDate: new Date(),
      duration: new Date(),
      genre: Genre.ROCK,
    };
    await controller.updateSong(id, dto);
    expect(service.updateSong).toHaveBeenCalledWith(id, dto);
  });

  it('should call getSong with id', async () => {
    const id = 'song-id';
    await controller.getSong(id);
    expect(service.getSong).toHaveBeenCalledWith(id);
  });

  it('should call searchSongs with query', async () => {
    const query = 'search-term';
    await controller.searchSongs(query);
    expect(service.searchSongs).toHaveBeenCalledWith(query);
  });

  it('should call deleteSong with id', async () => {
    const id = 'song-id';
    await controller.deleteSong(id);
    expect(service.deleteSong).toHaveBeenCalledWith(id);
  });

  it('should call addToFavorites with user and id', async () => {
    const id = 'song-id';
    await controller.addToFavorites(mockUser, id);
    expect(service.addToFavorites).toHaveBeenCalledWith(mockUser, id);
  });

  it('should call removeFromFavorites with user and id', async () => {
    const id = 'song-id';
    await controller.removeFromFavorites(mockUser, id);
    expect(service.removeFromFavorites).toHaveBeenCalledWith(mockUser, id);
  });
});
