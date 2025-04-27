import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song, Genre } from '../../shared/entities/song.entity';
import { Favorite } from '../../shared/entities/favorite.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from '../../shared/entities/user.entity';


const mockUser: User = {
  id: 'user-id',
  email: 'test@example.com',
  password: 'hashed',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
} as User;

const mockFavorite: Favorite = {
  id: 'fav-1',
  user: mockUser,
  song: {} as Song, // Temporarily assign empty to allow circular reference
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  toJSON: jest.fn(),
};

const mockSong: Song = {
  id: '1',
  title: 'Test Song',
  artists: 'Test Artist',
  releasedDate: new Date(),
  duration: new Date(),
  genre: Genre.POP,
  playListId: null,
  user: mockUser,
  playList: null,
  favorites: [mockFavorite], // Correctly assign as array of Favorite
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  toJSON: jest.fn(),
};

// Fix circular reference
mockFavorite.song = mockSong;

describe('SongsService', () => {
  let service: SongsService;
  let songRepo: Repository<Song>;
  let favoriteRepo: Repository<Favorite>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: getRepositoryToken(Song),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockResolvedValue(mockSong),
            find: jest.fn().mockResolvedValue([mockSong]),
            findOne: jest.fn().mockResolvedValue(mockSong),
            delete: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: getRepositoryToken(Favorite),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockResolvedValue({}),
            remove: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    songRepo = module.get<Repository<Song>>(getRepositoryToken(Song));
    favoriteRepo = module.get<Repository<Favorite>>(getRepositoryToken(Favorite));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSong', () => {
    it('should create and return a song', async () => {
      const result = await service.createSong(mockSong as any);
      expect(result.song).toEqual(mockSong);
    });
  });

  describe('getSongs', () => {
    it('should return all songs', async () => {
      const result = await service.getSongs();
      expect(result.data).toEqual([mockSong]);
    });
  });

  describe('getSong', () => {
    it('should return a song by id', async () => {
      const result = await service.getSong('1');
      expect(result.song).toEqual(mockSong);
    });

    it('should throw NotFoundException if song not found', async () => {
      jest.spyOn(songRepo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.getSong('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateSong', () => {
    it('should update a song', async () => {
      const result = await service.updateSong('1', { title: 'Updated', ...mockSong });
      expect(result.song).toEqual(mockSong);
    });

    it('should throw NotFoundException if song not found', async () => {
      jest.spyOn(songRepo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.updateSong('999', mockSong as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteSong', () => {
    it('should delete a song', async () => {
      const result = await service.deleteSong('1');
      expect(result).toEqual({ message: 'Song deleted successfully' });
    });

    it('should throw NotFoundException if song not found', async () => {
      jest.spyOn(songRepo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.deleteSong('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('searchSongs', () => {
    it('should return all songs if no query', async () => {
      const result = await service.searchSongs(null);
      expect(result.data).toEqual([mockSong]);
    });

    it('should return matched songs if query is present', async () => {
      jest.spyOn(songRepo, 'find').mockResolvedValueOnce([mockSong]);
      const result = await service.searchSongs('Test');
      expect(result.data).toEqual([mockSong]);
    });
  });

  describe('getFavorites', () => {
    it('should return no favorites if none exist', async () => {
      jest.spyOn(favoriteRepo, 'find').mockResolvedValueOnce([]);
      const result = await service.getFavorites(mockUser);
      expect(result.message).toEqual('No favorite songs found');
    });

    it('should return favorites', async () => {
      jest.spyOn(favoriteRepo, 'find').mockResolvedValueOnce([mockFavorite]);
      const result = await service.getFavorites(mockUser);
      expect(result.message).toEqual('Favorite songs retrieved successfully');
    });
  });

  describe('addToFavorites', () => {
    it('should add a song to favorites', async () => {
      jest.spyOn(favoriteRepo, 'findOne').mockResolvedValueOnce(null);
      const result = await service.addToFavorites(mockUser, '1');
      expect(result.message).toEqual('Song added to favorites successfully');
    });

    it('should return existing favorite if already added', async () => {
      jest.spyOn(favoriteRepo, 'findOne').mockResolvedValueOnce(mockFavorite);
      const result = await service.addToFavorites(mockUser, '1');
      expect(result.message).toEqual('Song is already in favorites');
    });

    it('should throw NotFoundException if song not found', async () => {
      jest.spyOn(songRepo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.addToFavorites(mockUser, '999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFromFavorites', () => {
    it('should remove a favorite song', async () => {
      jest.spyOn(favoriteRepo, 'findOne').mockResolvedValueOnce(mockFavorite);
      const result = await service.removeFromFavorites(mockUser, '1');
      expect(result.message).toEqual('Song removed from favorites successfully');
    });

    it('should throw NotFoundException if favorite not found', async () => {
      jest.spyOn(favoriteRepo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.removeFromFavorites(mockUser, '999')).rejects.toThrow(NotFoundException);
    });
  });
});
