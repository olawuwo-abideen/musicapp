import { Test, TestingModule } from '@nestjs/testing';
import { PlayListsService } from './playlists.service';

describe('PlaylistsService', () => {
  let service: PlayListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayListsService],
    }).compile();

    service = module.get<PlayListsService>(PlayListsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
