import { Test, TestingModule } from '@nestjs/testing';
import { PlayListsService } from './playlists.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Playlist } from '../../shared/entities/playlist.entity';
import { Song } from '../../shared/entities/song.entity';
import { User } from '../../shared/entities/user.entity';
import { Repository, EntityManager } from 'typeorm';

describe('PlayListsService', () => {
  let service: PlayListsService;
  let playListRepo: jest.Mocked<Repository<Playlist>>;
  let user: User;

  const mockPlaylistRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockSongRepo = {
    findOne: jest.fn(),
  };

  const mockUserRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayListsService,
        { provide: getRepositoryToken(Playlist), useValue: mockPlaylistRepo },
        { provide: getRepositoryToken(Song), useValue: mockSongRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: EntityManager, useValue: {} }, // ✅ Correct fix
      ],
    }).compile();

    service = module.get<PlayListsService>(PlayListsService);
    playListRepo = module.get(getRepositoryToken(Playlist));
    user = { id: 'user-id-1' } as User;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPlaylist', () => {
    it('should create a playlist successfully', async () => {
      const dto = { name: 'My Playlist' };

      mockPlaylistRepo.findOne.mockResolvedValue(null);
      mockPlaylistRepo.create.mockReturnValue({ id: 'playlist-id', ...dto, userId: user.id });
      mockPlaylistRepo.save.mockResolvedValue({
        id: 'playlist-id',
        name: dto.name,
        userId: user.id,
      });

      const result = await service.createPlaylist(dto, user);

      expect(mockPlaylistRepo.findOne).toHaveBeenCalledWith({
        where: { name: dto.name, userId: user.id },
      });

      expect(mockPlaylistRepo.create).toHaveBeenCalledWith({
        name: dto.name,
        userId: user.id,
      });

      expect(mockPlaylistRepo.save).toHaveBeenCalled();

      expect(result).toEqual({
        message: 'Playlist created successfully',
        playlist: {
          id: 'playlist-id',
          name: dto.name,
          userId: user.id,
        },
      });
    });

    it('should return message if playlist name already exists', async () => {
      const dto = { name: 'Existing Playlist' };

      mockPlaylistRepo.findOne.mockResolvedValue({ id: 'existing-id', ...dto });

      const result = await service.createPlaylist(dto, user);

      expect(result).toEqual({
        message: 'Playlist name already exists',
      });
    });
  });
});
