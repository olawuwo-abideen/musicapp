import {
Controller,
Get,
Put,
Delete,
Post,
Param,
Body,
Query,
UseInterceptors
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDTO, UpdateAlbumDTO } from './dto/albums-dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsValidUUIDPipe } from '../../shared/pipes/is-valid-uuid.pipe';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';



@ApiBearerAuth()
@Controller('album')
@ApiTags('Album')
export class AlbumsController {
constructor(private albumsService: AlbumsService) {}

@Post('')
@ApiOperation({ summary: 'Create album' })
public async createAlbum(
@Body() data: CreateAlbumDTO,
) {
return await this.albumsService.createAlbum(data)
}

@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get('')
@ApiOperation({ summary: 'Get album' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async getAlbums(@Query() paginationDto: PaginationDto) {
  return await this.albumsService.getAlbums(paginationDto);
}

@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get('search')
@ApiOperation({ summary: 'Search album' })
@ApiQuery({ name: 'query', required: false, example: 'Pop' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async searchAlbums(
  @Query('query') searchQuery: string | null,
  @Query() pagination: PaginationDto,
) {
  return await this.albumsService.searchAlbums(searchQuery, pagination);
}

@Put(':id')
@ApiOperation({ summary: 'Update album' })
public async updateAlbum(
@Param('id', IsValidUUIDPipe) id: string,
@Body() data: UpdateAlbumDTO,
) {
return  await this.albumsService.updateAlbum(
id,
data,
)
}

@Delete(':id')
@ApiOperation({ summary: 'Delete album' })
public async deleteAlbum(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.albumsService.deleteAlbum(id)
}

@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get(':id')
@ApiOperation({ summary: 'Get an album' })
public async getAlbum(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.albumsService.getAlbum(id)

}


@Post(':songId/:albumId')
@ApiOperation({ summary: 'Add song album' })
async addSongToAlbum(
@Param('songId') songId: string,
@Param('albumId') albumId: string,
) {
return await this.albumsService.addSongToAlbum(songId, albumId);
}



@Delete(':albumId/:songId')
@ApiOperation({ summary: 'Remove song from album' })
async removeSongFromAlbum(
@Param('albumId', IsValidUUIDPipe) albumId: string,
@Param('songId', IsValidUUIDPipe) songId: string,
) {
return this.albumsService.removeSongFromAlbum(albumId, songId);
}



}