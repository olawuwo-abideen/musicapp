import { Test, TestingModule } from '@nestjs/testing';
import { PlayListsController } from './playlists.controller';
import { PlayListsService } from './playlists.service';
import {
  CreatePlayListDto,
  AddSongToPlayListDto,
  RemoveSongToPlayListDto,
  UpdatePlayListDto,
} from './dto/create-playlist.dto';
import { User } from '../../shared/entities/user.entity';

describe('PlayListsController', () => {
  let controller: PlayListsController;
  let service: PlayListsService;
 
  const mockUser: User = { id: 'user-id' } as User;

  const mockService = {
    createPlaylist: jest.fn(),
    getPlaylists: jest.fn(),
    getPlaylist: jest.fn(),
    updatePlaylist: jest.fn(),
    deletePlaylist: jest.fn(),
    getPlaylistSongs: jest.fn(),
    AddSongToPlayList: jest.fn(),
    removeSongFromPlaylist: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayListsController],
      providers: [
        {
          provide: PlayListsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PlayListsController>(PlayListsController);
    service = module.get<PlayListsService>(PlayListsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a playlist', async () => {
    const dto: CreatePlayListDto = { name: 'My Playlist' };
    await controller.createPlaylist(dto, mockUser);
    expect(service.createPlaylist).toHaveBeenCalledWith(dto, mockUser);
  });

  it('should return playlists', async () => {
    await controller.getPlaylists(mockUser);
    expect(service.getPlaylists).toHaveBeenCalledWith(mockUser);
  });

  it('should return a specific playlist', async () => {
    await controller.getPlaylist('playlist-id', mockUser);
    expect(service.getPlaylist).toHaveBeenCalledWith('playlist-id', mockUser);
  });

  it('should update a playlist', async () => {
    const dto: UpdatePlayListDto = { name: 'Updated Playlist' };
    await controller.updatePlaylist('playlist-id', dto, mockUser);
    expect(service.updatePlaylist).toHaveBeenCalledWith('playlist-id', dto, mockUser);
  });

  it('should delete a playlist', async () => {
    await controller.deletePlaylist('playlist-id', mockUser);
    expect(service.deletePlaylist).toHaveBeenCalledWith('playlist-id', mockUser);
  });

  it('should get songs in a playlist', async () => {
    await controller.getPlaylistSongs('playlist-id', mockUser);
    expect(service.getPlaylistSongs).toHaveBeenCalledWith('playlist-id', mockUser);
  });

  it('should add a song to a playlist', async () => {
    const dto: AddSongToPlayListDto = { songId: 'song-id' };
    await controller.AddSongToPlayList(dto, 'playlist-id', mockUser);
    expect(service.AddSongToPlayList).toHaveBeenCalledWith(dto, mockUser, 'playlist-id');
  });

  it('should remove a song from a playlist', async () => {
    const dto: RemoveSongToPlayListDto = { songId: 'song-id' };
    await controller.removeSongFromPlaylist(dto, 'playlist-id', mockUser);
    expect(service.removeSongFromPlaylist).toHaveBeenCalledWith(dto, 'playlist-id', mockUser);
  });
});
