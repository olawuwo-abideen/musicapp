import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreatePlayListDto,
  AddSongToPlayListDto,
  RemoveSongToPlayListDto,
} from './dto/create-playlist.dto';
import { PlayListsService } from './playlists.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../../shared/entities/user.entity';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { IsValidUUIDPipe } from '../../shared/pipes/is-valid-uuid.pipe';
import { UpdatePlayListDto } from './dto/create-playlist.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@ApiBearerAuth()
@Controller('playlists')
@ApiTags('Playlists')
@UseInterceptors(CacheInterceptor) 
export class PlayListsController {
  constructor(private playListService: PlayListsService) {}

  @Post('')
  public async createPlaylist(
    @Body() payload: CreatePlayListDto,
    @CurrentUser() user: User,
  ) {
    return await this.playListService.createPlaylist(payload, user);
  }

  @Get('')
  @CacheKey('__key')
  @CacheTTL(600) 
  public async getPlaylists(@CurrentUser() user: User) {
    return await this.playListService.getPlaylists(user);
  }

  @Get(':id')
  @CacheKey('__key') 
  @CacheTTL(600) 
  public async getPlaylist(
    @Param('id', IsValidUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.playListService.getPlaylist(id, user);
  }

  @Put(':id')
  public async updatePlaylist(
    @Param('id', IsValidUUIDPipe) id: string,
    @Body() payload: UpdatePlayListDto,
    @CurrentUser() user: User,
  ) {
    return await this.playListService.updatePlaylist(id, payload, user);
  }

  @Delete(':id')
  public async deletePlaylist(
    @Param('id', IsValidUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.playListService.deletePlaylist(id, user);
  }

  @Get('song/:id')
  @CacheKey('__key') 
  @CacheTTL(600) 
  public async getPlaylistSongs(
    @Param('id', IsValidUUIDPipe) playlistId: string,
    @CurrentUser() user: User,
  ) {
    return await this.playListService.getPlaylistSongs(playlistId, user);
  }

  @Post('song/:id')
  public async AddSongToPlayList(
    @Body() payload: AddSongToPlayListDto,
    @Param('id', IsValidUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.playListService.AddSongToPlayList(payload, user, id);
  }

  @Delete('song/:id')
  public async removeSongFromPlaylist(
    @Body() payload: RemoveSongToPlayListDto,
    @Param('id', IsValidUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.playListService.removeSongFromPlaylist(payload, id, user);
  }
}
