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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsValidUUIDPipe } from '../../shared/pipes/is-valid-uuid.pipe';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';



@ApiBearerAuth()
@Controller('album')
@ApiTags('Album')
export class AlbumsController {
constructor(private albumsService: AlbumsService) {}

@Post('')
public async createAlbum(
@Body() data: CreateAlbumDTO,
) {
return await this.albumsService.createAlbum(data)
}

@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get('')
public async getAlbums(
) {
return await this.albumsService.getAlbums(
);
}

@Put(':id')
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
public async deleteAlbum(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.albumsService.deleteAlbum(id)
}

@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get(':id')
public async getAlbum(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.albumsService.getAlbum(id)

}

@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get('search')
public async searchAlbums(
@Query('query') searchQuery: string | null,
) {
return await this.albumsService.searchAlbums(
searchQuery,
);
}


@Post(':songId/album/:albumId')
async addToAlbum(
@Param('songId') songId: string,
@Param('albumId') albumId: string,
) {
return await this.albumsService.addSongToAlbum(songId, albumId);
}



@Delete('song/:id')
async removeFromFavorites(
@Param('id', IsValidUUIDPipe) id: string,
) {
return this.albumsService.removeSongFromAlbum(id);
}



}