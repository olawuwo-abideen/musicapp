import {
Controller,
Get,
Put,
Delete,
Post,
Param,
Body,
Query,
Req,
UseInterceptors
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO, UpdateSongDto } from './dto/song-dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsValidUUIDPipe } from '../../shared/pipes/is-valid-uuid.pipe';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../../shared/entities/user.entity';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';



@ApiBearerAuth()
@Controller('song')
@ApiTags('Song')
export class SongsController {
constructor(private songsService: SongsService) {}

@Post('')
@ApiOperation({ summary: 'Create song' })
public async createSong(
@Body() data: CreateSongDTO,
) {
return await this.songsService.createSong(data)
}

@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get('')
@ApiOperation({ summary: 'Get songs' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async getSongs(@Query() pagination: PaginationDto) {
  return await this.songsService.getSongs(pagination);
}

@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get('search')
@ApiOperation({ summary: 'Search a song' })
@ApiQuery({ name: 'query', required: false, example: 'Love' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async searchSongs(
  @Query('query') searchQuery: string | null,
  @Query() pagination: PaginationDto,
) {
  return await this.songsService.searchSongs(searchQuery, pagination);
}

@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get('favorite')
@ApiOperation({ summary: 'Get favorite song' })
async getFavorites(
  @CurrentUser() user: User,
  @Query() pagination: PaginationDto,
) {
  return await this.songsService.getFavorites(user, pagination);
}


@Put(':id')
@ApiOperation({ summary: 'Update a song' })
public async updateSong(
@Param('id', IsValidUUIDPipe) id: string,
@Body() data: UpdateSongDto,
) {
return  await this.songsService.updateSong(
id,
data,
)
}

@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get(':id')
@ApiOperation({ summary: 'Get a song' })
public async getSong(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.songsService.getSong(id)

}



@Delete(':id')
@ApiOperation({ summary: 'Delete a song' })
public async deleteSong(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.songsService.deleteSong(id)
}

@Post('play/:id')
@ApiOperation({ summary: 'Play a song' })
async playSong(@Param('id', IsValidUUIDPipe) id: string) {
  return this.songsService.incrementPlayCounter(id);
}


@Post('favorite/:id')
@ApiOperation({ summary: 'Add song to favorite' })
async addToFavorites(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) id: string,

) {
return this.songsService.addToFavorites(user, id);
}

@Delete('favorite/:id')
@ApiOperation({ summary: 'Remove song from favorite' })
async removeFromFavorites(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) id: string,

) {
return this.songsService.removeFromFavorites(user, id);
}




}