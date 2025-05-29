import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import {
  CreatePlayListDto,
  AddSongToPlayListDto,
  RemoveSongToPlayListDto,
} from './dto/create-playlist.dto';
import { PlayListsService } from './playlists.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../../shared/entities/user.entity';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { IsValidUUIDPipe } from '../../shared/pipes/is-valid-uuid.pipe';
import { UpdatePlayListDto } from './dto/create-playlist.dto';


@ApiBearerAuth()
@Controller('playlist')
@ApiTags('Playlist')
export class PlayListsController {
  constructor(private playListService: PlayListsService) {}

  @Post('')
  @ApiOperation({ summary: 'Create playlist' })
  public async createPlaylist(
    @Body() payload: CreatePlayListDto,
    @CurrentUser() user: User,
  ) {
    return await this.playListService.createPlaylist(payload, user);
  }

  @Get('')
  @ApiOperation({ summary: 'Get playlists' })
  public async getPlaylists(@CurrentUser() user: User) {
    return await this.playListService.getPlaylists(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a playlist' })
  public async getPlaylist(
    @Param('id', IsValidUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.playListService.getPlaylist(id, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a playlist' })
  public async updatePlaylist(
    @Param('id', IsValidUUIDPipe) id: string,
    @Body() payload: UpdatePlayListDto,
    @CurrentUser() user: User,
  ) {
    return await this.playListService.updatePlaylist(id, payload, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a playlist' })
  public async deletePlaylist(
    @Param('id', IsValidUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.playListService.deletePlaylist(id, user);
  }

  @Get('song/:id')
  @ApiOperation({ summary: 'Get playlist song' })
  public async getPlaylistSongs(
    @Param('id', IsValidUUIDPipe) playlistId: string,
    @CurrentUser() user: User,
  ) {
    return await this.playListService.getPlaylistSongs(playlistId, user);
  }

  @Post('song/:id')
  @ApiOperation({ summary: 'Add a song to playlist' })
  public async AddSongToPlayList(
    @Body() payload: AddSongToPlayListDto,
    @Param('id', IsValidUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.playListService.AddSongToPlayList(payload, user, id);
  }

  @Delete('song/:id')
  @ApiOperation({ summary: 'Remove song from playlist' })
  public async removeSongFromPlaylist(
    @Body() payload: RemoveSongToPlayListDto,
    @Param('id', IsValidUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.playListService.removeSongFromPlaylist(payload, id, user);
  }
}
