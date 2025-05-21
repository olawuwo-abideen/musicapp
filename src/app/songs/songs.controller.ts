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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsValidUUIDPipe } from '../../shared/pipes/is-valid-uuid.pipe';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../../shared/entities/user.entity';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';



@ApiBearerAuth()
@Controller('song')
@ApiTags('Song')
export class SongsController {
constructor(private songsService: SongsService) {}

@Post('')
public async createSong(
@Body() data: CreateSongDTO,
) {
return await this.songsService.createSong(data)
}

@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get('')
public async getSongs(
) {
return await this.songsService.getSongs(
);
}

@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get('favorite')
async getFavorites(@CurrentUser() user: User) {
return await this.songsService.getFavorites(user);
}


@Put(':id')
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
public async getSong(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.songsService.getSong(id)

}

@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get('search')
public async searchSongs(
@Query('query') searchQuery: string | null,
) {
return await this.songsService.searchSongs(
searchQuery,
);
}

@Delete(':id')
public async deleteSong(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.songsService.deleteSong(id)
}




@Post('favorite/:id')
async addToFavorites(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) id: string,

) {
return this.songsService.addToFavorites(user, id);
}

@Delete('favorite/:id')
async removeFromFavorites(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) id: string,

) {
return this.songsService.removeFromFavorites(user, id);
}




}